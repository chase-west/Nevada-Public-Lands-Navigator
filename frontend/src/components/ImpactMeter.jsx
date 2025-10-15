import { useState, useEffect } from 'react';

function ImpactMeter({ label, value, maxValue = 10, color = '#0066FF', icon, description }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = (value / maxValue) * 100;

  useEffect(() => {
    // Animate the bar on mount
    const timer = setTimeout(() => {
      setAnimatedValue(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getColorByValue = () => {
    if (color !== '#0066FF') return color; // Use custom color if provided

    // Auto color based on value
    if (value >= 8) return '#FF6B6B'; // High impact - red
    if (value >= 5) return '#FFA500'; // Medium impact - orange
    return '#4ECDC4'; // Low impact - teal
  };

  const actualColor = getColorByValue();

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-lg">{icon}</span>
          )}
          <span className="text-sm font-semibold text-nevada-900">{label}</span>
        </div>
        <span className="text-xs font-bold text-nevada-600 tabular-nums">
          {value}/{maxValue}
        </span>
      </div>

      {/* Progress bar container */}
      <div className="relative h-3 bg-nevada-100 rounded-full overflow-hidden border-2 border-nevada-900">
        {/* Animated fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${animatedValue}%`,
            backgroundColor: actualColor,
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="mt-2 text-xs text-nevada-600 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </p>
      )}
    </div>
  );
}

function ImpactMeters({ impacts }) {
  // Calculate impact scores from text length and sentiment
  const calculateImpactScore = (text) => {
    if (!text || text === 'Not applicable') return 0;

    // Base score on text length and certain keywords
    const length = text.length;
    const hasHighImpactWords = /significant|major|substantial|critical|essential|important/i.test(text);
    const hasNegativeWords = /risk|damage|loss|negative|concern|challenge/i.test(text);
    const hasPositiveWords = /improve|benefit|enhance|protect|opportunity|positive/i.test(text);

    let score = Math.min(Math.ceil(length / 50), 10);

    if (hasHighImpactWords) score = Math.min(score + 2, 10);
    if (hasNegativeWords) score = Math.min(score + 1, 10);
    if (hasPositiveWords) score = Math.min(score + 1, 10);

    return Math.max(1, score);
  };

  return (
    <div className="space-y-6">
      {impacts.environmental && (
        <ImpactMeter
          label="Environmental Impact"
          value={calculateImpactScore(impacts.environmental)}
          icon="🌲"
          color="#4ECDC4"
          description="Based on ecosystem effects, conservation potential, and habitat changes"
        />
      )}
      {impacts.economic && (
        <ImpactMeter
          label="Economic Impact"
          value={calculateImpactScore(impacts.economic)}
          icon="💰"
          color="#45B7D1"
          description="Based on financial implications and development opportunities"
        />
      )}
      {impacts.community && (
        <ImpactMeter
          label="Community Impact"
          value={calculateImpactScore(impacts.community)}
          icon="👥"
          color="#9B59B6"
          description="Based on public access, safety, and local control"
        />
      )}
      {impacts.cultural && impacts.cultural !== 'Not applicable' && (
        <ImpactMeter
          label="Cultural Impact"
          value={calculateImpactScore(impacts.cultural)}
          icon="🏛️"
          color="#E67E22"
          description="Based on historical significance and cultural heritage"
        />
      )}
    </div>
  );
}

export { ImpactMeter, ImpactMeters };
