import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewMetrics } from "@/components/dashboard/OverviewMetrics";
import { ClusterVisualization } from "@/components/dashboard/ClusterVisualization";
import { SentimentChart } from "@/components/dashboard/SentimentChart";
import { TrendAnalysis } from "@/components/dashboard/TrendAnalysis";
import { WordCloudViz } from "@/components/dashboard/WordCloudViz";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Tweet Analysis Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Mental Health & Depression Insights
            </p>
          </div>
        </div>

        <OverviewMetrics />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clusters">Clusters</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-card border-border shadow-card">
                <h3 className="text-xl font-semibold mb-4">Sentiment Distribution</h3>
                <SentimentChart />
              </Card>
              <Card className="p-6 bg-gradient-card border-border shadow-card">
                <h3 className="text-xl font-semibold mb-4">Topic Word Cloud</h3>
                <WordCloudViz />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clusters" className="space-y-6">
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <h3 className="text-xl font-semibold mb-4">Cluster Visualization</h3>
              <ClusterVisualization />
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <h3 className="text-xl font-semibold mb-4">Sentiment Analysis</h3>
              <SentimentChart detailed />
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <h3 className="text-xl font-semibold mb-4">Trend Analysis</h3>
              <TrendAnalysis />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
