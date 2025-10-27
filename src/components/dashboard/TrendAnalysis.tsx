import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAnalysis } from "@/contexts/AnalysisContext";

export const TrendAnalysis = () => {
  const { results } = useAnalysis();

  const data = results?.trends || [];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
        <XAxis dataKey="date" stroke="hsl(215, 20%, 65%)" />
        <YAxis stroke="hsl(215, 20%, 65%)" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="positive"
          stroke="hsl(142, 76%, 36%)"
          strokeWidth={2}
          dot={{ fill: "hsl(142, 76%, 36%)" }}
        />
        <Line
          type="monotone"
          dataKey="neutral"
          stroke="hsl(197, 71%, 52%)"
          strokeWidth={2}
          dot={{ fill: "hsl(197, 71%, 52%)" }}
        />
        <Line
          type="monotone"
          dataKey="negative"
          stroke="hsl(0, 84%, 60%)"
          strokeWidth={2}
          dot={{ fill: "hsl(0, 84%, 60%)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
