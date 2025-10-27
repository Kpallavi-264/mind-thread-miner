import { Card } from "@/components/ui/card";
import { Users, Target, TrendingUp, MessageSquare } from "lucide-react";
import { useAnalysis } from "@/contexts/AnalysisContext";

export const OverviewMetrics = () => {
  const { results, isProcessing } = useAnalysis();

  const metrics = [
    {
      title: "Total Tweets",
      value: results?.tweets.length || 0,
      icon: MessageSquare,
      color: "text-primary",
    },
    {
      title: "Unique Clusters",
      value: results?.clusters.length || 0,
      icon: Target,
      color: "text-accent",
    },
    {
      title: "Avg Sentiment",
      value: results ? 
        ((results.sentimentDistribution.positive - results.sentimentDistribution.negative) / results.tweets.length * 100).toFixed(1) + "%" :
        "0%",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Keywords Found",
      value: results?.topWords.length || 0,
      icon: Users,
      color: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="p-6 bg-gradient-card border-border shadow-card hover:shadow-glow transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{metric.title}</p>
              <p className="text-3xl font-bold mt-2">
                {isProcessing ? "..." : metric.value}
              </p>
            </div>
            <metric.icon className={`w-10 h-10 ${metric.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};
