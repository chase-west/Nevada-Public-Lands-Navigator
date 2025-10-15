-- Create AI summaries table for caching OpenAI responses
CREATE TABLE IF NOT EXISTS ai_summaries (
  id SERIAL PRIMARY KEY,
  parcel_id INTEGER UNIQUE REFERENCES parcels(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  impact_analysis TEXT,
  stakeholders TEXT,
  civic_actions TEXT,
  model_used VARCHAR(50) DEFAULT 'gpt-4o-mini',
  tokens_used INTEGER,
  cost_usd NUMERIC(10, 6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_ai_summaries_parcel_id ON ai_summaries(parcel_id);

-- Create trigger for ai_summaries
DROP TRIGGER IF EXISTS update_ai_summaries_updated_at ON ai_summaries;
CREATE TRIGGER update_ai_summaries_updated_at
BEFORE UPDATE ON ai_summaries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
