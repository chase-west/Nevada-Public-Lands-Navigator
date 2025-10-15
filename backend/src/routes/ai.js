import express from 'express';
import OpenAI from 'openai';
import pool from '../config/database.js';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// GET /api/ai/summary/:parcelId - Get or generate AI summary for a parcel
router.get('/summary/:parcelId', async (req, res) => {
  try {
    const { parcelId } = req.params;

    // Check if we already have a cached summary
    const cacheQuery = 'SELECT * FROM ai_summaries WHERE parcel_id = $1';
    const cacheResult = await pool.query(cacheQuery, [parcelId]);

    if (cacheResult.rows.length > 0) {
      console.log(`✅ Returning cached summary for parcel ${parcelId}`);
      return res.json(cacheResult.rows[0]);
    }

    // Fetch parcel details
    const parcelQuery = `
      SELECT p.*, b.name as bill_name, b.number as bill_number, b.status as bill_status
      FROM parcels p
      LEFT JOIN bills b ON p.bill_id = b.id
      WHERE p.id = $1
    `;
    const parcelResult = await pool.query(parcelQuery, [parcelId]);

    if (parcelResult.rows.length === 0) {
      return res.status(404).json({ error: 'Parcel not found' });
    }

    const parcel = parcelResult.rows[0];

    console.log(`🤖 Generating AI summary for parcel ${parcelId}: ${parcel.name}`);

    // Generate AI summary using GPT-5 mini (best value, excellent quality)
    // Note: GPT-5 models don't support temperature, top_p, logprobs
    // GPT-5 uses tokens for internal reasoning + output, so need higher limit
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert policy analyst specializing in federal land management and civic engagement. Your job is to help citizens understand proposed federal land transfers in Nevada. Provide clear, factual, and actionable information that helps people engage with their government. Always respond with valid JSON only.`
        },
        {
          role: 'user',
          content: `Analyze this proposed federal land transfer in Nevada:

Parcel: ${parcel.name}
Location: ${parcel.county} County, Nevada
Size: ${parcel.acres} acres
Proposed Use: ${parcel.use_type}
Description: ${parcel.description || 'No description provided'}
Related Bill: ${parcel.bill_name || 'None'} (${parcel.bill_number || 'N/A'})
Bill Status: ${parcel.bill_status || 'Unknown'}

Respond with ONLY a JSON object (no markdown, no code blocks, just raw JSON) in this exact format:
{
  "summary": "2-3 sentences explaining what this land transfer means in plain English. Be specific and concrete.",
  "impact_analysis": {
    "environmental": "Environmental impacts in 2-3 sentences",
    "economic": "Economic impacts in 2-3 sentences",
    "community": "Community impacts in 2-3 sentences",
    "cultural": "Cultural/historical significance in 1-2 sentences (if relevant, otherwise say 'Not applicable')"
  },
  "stakeholders": {
    "supporters": "Groups likely to support and why (2-3 sentences)",
    "opponents": "Groups likely to oppose and why (2-3 sentences)",
    "neutral": "Groups with mixed interests (1-2 sentences)"
  },
  "civic_actions": {
    "representatives": "Nevada's US Senators (Catherine Cortez Masto, Jacky Rosen) and relevant House representatives for ${parcel.county} County",
    "how_to_comment": "Specific steps to submit public comments",
    "organizations": "2-3 specific Nevada-based organizations working on this issue with brief descriptions",
    "next_steps": "Immediate actions citizens can take this week"
  }
}

Be factual, balanced, and focus on empowering civic engagement. Use concrete details, not vague statements.`
        }
      ],
      max_completion_tokens: 5000
    });

    let rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error(`OpenAI returned empty response. This may indicate reasoning tokens exhausted the token limit.`);
    }

    // GPT-5 sometimes wraps JSON in markdown code blocks, strip them
    rawContent = rawContent.trim();
    if (rawContent.startsWith('```json')) {
      rawContent = rawContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (rawContent.startsWith('```')) {
      rawContent = rawContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let aiResponse;
    try {
      aiResponse = JSON.parse(rawContent);
    } catch (parseError) {
      // GPT-5 sometimes returns incomplete JSON - try to repair it
      console.warn(`⚠️ JSON parse error: ${parseError.message}`);

      // Check if response was cut off mid-JSON
      if (!rawContent.trim().endsWith('}')) {
        // Try adding missing closing braces
        const openBraces = (rawContent.match(/{/g) || []).length;
        const closeBraces = (rawContent.match(/}/g) || []).length;
        if (openBraces > closeBraces) {
          rawContent += '}'.repeat(openBraces - closeBraces);
          console.log('🔧 Auto-repaired incomplete JSON');
        }
      }

      try {
        aiResponse = JSON.parse(rawContent);
      } catch (secondError) {
        console.error('❌ JSON still invalid after repair attempt');
        throw new Error(`GPT-5 returned malformed JSON. This happens occasionally with reasoning models. Please try clicking the parcel again.`);
      }
    }
    const usage = completion.usage;

    // Calculate cost (GPT-5 mini pricing: $0.25 per 1M input, $2.00 per 1M output)
    const inputCost = (usage.prompt_tokens / 1000000) * 0.25;
    const outputCost = (usage.completion_tokens / 1000000) * 2.00;
    const totalCost = inputCost + outputCost;

    console.log(`💰 Cost: $${totalCost.toFixed(6)} (${usage.total_tokens} tokens)`);

    // Cache the result
    const insertQuery = `
      INSERT INTO ai_summaries (
        parcel_id, summary, impact_analysis, stakeholders, civic_actions,
        model_used, tokens_used, cost_usd
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const insertResult = await pool.query(insertQuery, [
      parcelId,
      aiResponse.summary,
      JSON.stringify(aiResponse.impact_analysis),
      JSON.stringify(aiResponse.stakeholders),
      JSON.stringify(aiResponse.civic_actions),
      'gpt-5-mini',
      usage.total_tokens,
      totalCost
    ]);

    console.log(`✅ Cached AI summary for parcel ${parcelId}`);

    res.json(insertResult.rows[0]);

  } catch (error) {
    console.error('Error generating AI summary:', error);
    res.status(500).json({
      error: 'Failed to generate summary',
      details: error.message
    });
  }
});

// GET /api/ai/stats - Get statistics about AI usage
router.get('/stats', async (req, res) => {
  try {
    const statsQuery = `
      SELECT
        COUNT(*) as total_summaries,
        SUM(tokens_used) as total_tokens,
        SUM(cost_usd) as total_cost,
        AVG(cost_usd) as avg_cost_per_summary
      FROM ai_summaries
    `;
    const result = await pool.query(statsQuery);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching AI stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
