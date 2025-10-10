import { Card } from "@/components/ui/card";
import { TrendingUp, Users, MessageSquare, Target } from "lucide-react";

export const OverviewMetrics = () => {
  const metrics = [
    {
      title: "Total Tweets",
      value: "12,847",
      change: "+12.5%",
      icon: MessageSquare,
      color: "text-primary",
    },
    {
      title: "Unique Clusters",
      value: "8",
      change: "Optimal",
      icon: Target,
      color: "text-accent",
    },
    {
      title: "Avg Sentiment",
      value: "0.42",
      change: "Neutral-Positive",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Active Users",
      value: "8,432",
      change: "+8.2%",
      icon: Users,
      color: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card
            key={index}
            className="p-6 bg-gradient-card border-border shadow-card hover:shadow-glow transition-shadow duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <h3 className="text-3xl font-bold">{metric.value}</h3>
                <p className={`text-sm ${metric.color}`}>{metric.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-secondary/50 ${metric.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
