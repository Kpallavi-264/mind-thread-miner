import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export const ClusterVisualization = () => {
  // Sample cluster data - in real app this would come from uploaded data
  const clusters = [
    { x: 12, y: 45, cluster: 0, size: 150 },
    { x: 34, y: 23, cluster: 1, size: 200 },
    { x: 56, y: 67, cluster: 2, size: 180 },
    { x: 78, y: 12, cluster: 0, size: 120 },
    { x: 23, y: 89, cluster: 3, size: 220 },
    { x: 45, y: 34, cluster: 1, size: 190 },
    { x: 67, y: 56, cluster: 2, size: 160 },
    { x: 89, y: 78, cluster: 4, size: 240 },
    { x: 15, y: 92, cluster: 3, size: 210 },
    { x: 91, y: 25, cluster: 5, size: 170 },
  ];

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
        <Scatter name="Tweets" data={clusters} fill="#8884d8">
          {clusters.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.cluster % colors.length]} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};
