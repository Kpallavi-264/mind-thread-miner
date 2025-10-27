import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useAnalysis } from "@/contexts/AnalysisContext";

interface SentimentChartProps {
  detailed?: boolean;
}

export const SentimentChart = ({ detailed = false }: SentimentChartProps) => {
  const { results } = useAnalysis();

  const data = results ? [
    { name: "Positive", value: results.sentimentDistribution.positive, color: "hsl(142, 76%, 36%)" },
    { name: "Neutral", value: results.sentimentDistribution.neutral, color: "hsl(197, 71%, 52%)" },
    { name: "Negative", value: results.sentimentDistribution.negative, color: "hsl(0, 84%, 60%)" },
  ] : [
    { name: "Positive", value: 0, color: "hsl(142, 76%, 36%)" },
    { name: "Neutral", value: 0, color: "hsl(197, 71%, 52%)" },
    { name: "Negative", value: 0, color: "hsl(0, 84%, 60%)" },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
