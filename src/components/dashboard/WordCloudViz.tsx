import { Badge } from "@/components/ui/badge";
import { useAnalysis } from "@/contexts/AnalysisContext";

export const WordCloudViz = () => {
  const { results } = useAnalysis();

  const words = results?.topWords.map((word, idx) => ({
    text: word.text,
    size: 32 - (idx * 1.5),
    color: ["text-primary", "text-accent", "text-success", "text-warning", "text-destructive"][idx % 5]
  })) || [];

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center p-6 min-h-[300px]">
      {words.length > 0 ? (
        words.map((word, index) => (
          <Badge
            key={index}
            variant="outline"
            className={`${word.color} border-current hover:bg-current/10 transition-colors cursor-pointer`}
            style={{ fontSize: `${word.size}px` }}
          >
            {word.text}
          </Badge>
        ))
      ) : (
        <p className="text-muted-foreground">Upload data to see word cloud</p>
      )}
    </div>
  );
};
