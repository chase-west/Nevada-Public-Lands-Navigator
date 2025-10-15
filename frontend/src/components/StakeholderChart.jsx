import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function StakeholderChart({ stakeholders }) {
  // Calculate engagement scores based on text analysis
  const calculateEngagement = (text) => {
    if (!text || text === 'Not applicable') return 0;

    const length = text.length;
    const hasMultipleGroups = text.split(',').length;

    return Math.max(1, Math.min(Math.ceil(length / 40) + hasMultipleGroups, 10));
  };

  const data = [
    {
      name: 'Supporters',
      value: calculateEngagement(stakeholders.supporters),
      description: stakeholders.supporters,
    },
    {
      name: 'Opponents',
      value: calculateEngagement(stakeholders.opponents),
      description: stakeholders.opponents,
    },
    {
      name: 'Mixed Interests',
      value: calculateEngagement(stakeholders.neutral),
      description: stakeholders.neutral,
    },
  ].filter(item => item.value > 0);

  const COLORS = {
    'Supporters': '#4ECDC4',
    'Opponents': '#FF6B6B',
    'Mixed Interests': '#FFA500',
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-nevada-900 text-white p-4 rounded-xl shadow-hard max-w-xs border-2 border-nevada-900">
          <p className="font-semibold mb-2 text-sm">{data.name}</p>
          <p className="text-xs opacity-90 leading-relaxed">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border-2 border-nevada-900"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-xs font-semibold text-nevada-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-nevada-600 text-sm">
        No stakeholder data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name]}
                stroke="#0d0f10"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Stakeholder breakdown */}
      <div className="mt-6 space-y-3">
        {data.map((item, index) => {
          const icon = item.name === 'Supporters' ? '✅' : item.name === 'Opponents' ? '⚠️' : '⚖️';
          const total = data.reduce((sum, d) => sum + d.value, 0);
          const percentage = ((item.value / total) * 100).toFixed(0);

          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl bg-nevada-50 border border-nevada-200 hover:border-nevada-300 transition-all duration-200 group"
            >
              <div
                className="w-10 h-10 rounded-lg border-2 border-nevada-900 flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: COLORS[item.name] }}
              >
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-nevada-900">{item.name}</p>
                  <p className="text-xs font-bold text-nevada-600 tabular-nums">{percentage}%</p>
                </div>
                <div className="h-1.5 bg-nevada-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: COLORS[item.name],
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StakeholderChart;
