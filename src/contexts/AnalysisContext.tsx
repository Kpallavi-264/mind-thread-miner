import { createContext, useContext, useState, ReactNode } from "react";

export interface Tweet {
  id: string;
  text: string;
  embedding?: number[];
  cluster?: number;
  sentiment?: "positive" | "negative" | "neutral";
  sentimentScore?: number;
}

export interface ClusterData {
  id: number;
  tweets: Tweet[];
  keywords: string[];
  avgSentiment: number;
}

export interface AnalysisResults {
  tweets: Tweet[];
  clusters: ClusterData[];
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topWords: Array<{ text: string; frequency: number }>;
  trends: Array<{
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
}

interface AnalysisContextType {
  results: AnalysisResults | null;
  setResults: (results: AnalysisResults | null) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <AnalysisContext.Provider value={{ results, setResults, isProcessing, setIsProcessing }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within AnalysisProvider");
  }
  return context;
};
