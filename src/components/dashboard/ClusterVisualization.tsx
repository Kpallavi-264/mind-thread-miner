import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useAnalysis } from "@/contexts/AnalysisContext";

export const ClusterVisualization = () => {
  const { results } = useAnalysis();

  // Convert embeddings to 2D for visualization using simple projection
  const scatterData = results?.tweets.map((tweet, idx) => {
    const embedding = tweet.embedding || [];
    return {
      x: embedding[0] ? embedding[0] * 100 : Math.random() * 100,
      y: embedding[1] ? embedding[1] * 100 : Math.random() * 100,
      cluster: tweet.cluster || 0,
      size: 150,
    };
  }) || [];

  const colors = [
    "hsl(262, 83%, 58%)",
    "hsl(197, 71%, 52%)",
    "hsl(142, 76%, 36%)",
    "hsl(38, 92%, 50%)",
    "hsl(0, 84%, 60%)",
    "hsl(280, 100%, 70%)",
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
        <XAxis type="number" dataKey="x" name="Component 1" stroke="hsl(215, 20%, 65%)" />
        <YAxis type="number" dataKey="y" name="Component 2" stroke="hsl(215, 20%, 65%)" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="Tweets" data={scatterData} fill="#8884d8">
          {scatterData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.cluster % colors.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};
