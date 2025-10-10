import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const TrendAnalysis = () => {
  const data = [
    { date: "Jan", positive: 240, neutral: 340, negative: 280 },
    { date: "Feb", positive: 280, neutral: 380, negative: 250 },
    { date: "Mar", positive: 320, neutral: 420, negative: 220 },
    { date: "Apr", positive: 290, neutral: 390, negative: 240 },
    { date: "May", positive: 350, neutral: 450, negative: 200 },
    { date: "Jun", positive: 380, neutral: 480, negative: 180 },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
        <XAxis dataKey="date" stroke="hsl(215, 20%, 65%)" />
        <YAxis stroke="hsl(215, 20%, 65%)" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "hsl(220, 23%, 13%)", 
            border: "1px solid hsl(220, 15%, 20%)",
            borderRadius: "8px"
          }} 
        />
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
