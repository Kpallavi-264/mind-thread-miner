import { useState, useCallback } from "react";
import { Upload, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { processTweets } from "@/lib/tweetProcessor";

export const UploadSection = () => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setResults, setIsProcessing } = useAnalysis();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    const validTypes = ['application/json', 'text/csv', 'text/plain'];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or JSON file",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing started",
      description: `Analyzing ${file.name} with SBERT embeddings...`,
    });

    setIsProcessing(true);
    navigate("/dashboard");

    try {
      const text = await file.text();
      let data: any[];
      
      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else {
        // Simple CSV parser
        const lines = text.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        data = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: any = {};
          headers.forEach((h, i) => obj[h] = values[i]?.trim());
          return obj;
        });
      }

      const results = await processTweets(data);
      setResults(results);
      
      toast({
        title: "Analysis complete!",
        description: `Processed ${results.tweets.length} tweets with ${results.clusters.length} clusters identified.`,
      });
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card 
      className={`relative p-12 bg-gradient-card border-2 transition-all duration-300 ${
        dragActive ? "border-primary shadow-glow" : "border-border"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".csv,.json"
        onChange={handleChange}
      />
      
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center cursor-pointer space-y-6"
      >
        <div className="p-6 rounded-full bg-primary/10 border-2 border-primary/20">
          <Upload className="w-16 h-16 text-primary" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold">Upload Your Data</h3>
          <p className="text-muted-foreground max-w-md">
            Drag and drop your preprocessed tweet data file here, or click to browse
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
            <FileJson className="w-5 h-5 text-accent" />
            <span className="text-sm">JSON</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
            <FileText className="w-5 h-5 text-accent" />
            <span className="text-sm">CSV</span>
          </div>
        </div>

        <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
          Select File
        </Button>
      </label>
    </Card>
  );
};
