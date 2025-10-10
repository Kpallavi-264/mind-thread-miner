import { UploadSection } from "@/components/UploadSection";
import { Brain, BarChart3, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Mental Health Analytics</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Depression Tweet
            </span>
            <br />
            <span className="text-foreground">Analysis Platform</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visualize semantic patterns, sentiment trends, and community insights from mental health discussions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-gradient-card border border-border">
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">SBERT Embeddings</h3>
            <p className="text-sm text-muted-foreground">
              Advanced semantic analysis using Sentence-BERT for deep understanding
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-card border border-border">
            <div className="p-3 rounded-lg bg-accent/10 w-fit mb-4">
              <BarChart3 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Clustering</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered topic detection and thematic grouping of discussions
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-card border border-border">
            <div className="p-3 rounded-lg bg-success/10 w-fit mb-4">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sentiment Insights</h3>
            <p className="text-sm text-muted-foreground">
              Track emotional patterns and community wellness trends over time
            </p>
          </div>
        </div>

        <UploadSection />

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Upload preprocessed CSV or JSON data from your Python analysis pipeline
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
