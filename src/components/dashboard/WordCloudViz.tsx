import { Badge } from "@/components/ui/badge";

export const WordCloudViz = () => {
  const words = [
    { text: "depression", size: 32, color: "text-primary" },
    { text: "anxiety", size: 28, color: "text-accent" },
    { text: "mental health", size: 24, color: "text-success" },
    { text: "support", size: 26, color: "text-warning" },
    { text: "help", size: 22, color: "text-primary" },
    { text: "therapy", size: 20, color: "text-accent" },
    { text: "wellness", size: 18, color: "text-success" },
    { text: "coping", size: 24, color: "text-primary" },
    { text: "recovery", size: 22, color: "text-accent" },
    { text: "awareness", size: 20, color: "text-warning" },
    { text: "stress", size: 26, color: "text-destructive" },
    { text: "mindfulness", size: 18, color: "text-success" },
    { text: "community", size: 24, color: "text-accent" },
    { text: "hope", size: 28, color: "text-success" },
    { text: "stigma", size: 20, color: "text-destructive" },
  ];

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center p-6 min-h-[300px]">
      {words.map((word, index) => (
        <Badge
          key={index}
          variant="outline"
          className={`${word.color} border-current hover:bg-current/10 transition-colors cursor-pointer`}
          style={{ fontSize: `${word.size}px` }}
        >
          {word.text}
        </Badge>
      ))}
    </div>
  );
};
