import { pipeline } from "@huggingface/transformers";
import type { Tweet, ClusterData, AnalysisResults } from "@/contexts/AnalysisContext";

// Simple K-Means implementation
function kMeans(vectors: number[][], k: number, maxIterations = 100): number[] {
  const n = vectors.length;
  const dim = vectors[0].length;
  
  // Initialize centroids randomly
  const centroids: number[][] = [];
  const indices = new Set<number>();
  while (centroids.length < k) {
    const idx = Math.floor(Math.random() * n);
    if (!indices.has(idx)) {
      indices.add(idx);
      centroids.push([...vectors[idx]]);
    }
  }
  
  let assignments = new Array(n).fill(0);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign points to nearest centroid
    const newAssignments = vectors.map((vec) => {
      let minDist = Infinity;
      let cluster = 0;
      
      centroids.forEach((centroid, i) => {
        const dist = euclideanDistance(vec, centroid);
        if (dist < minDist) {
          minDist = dist;
          cluster = i;
        }
      });
      
      return cluster;
    });
    
    // Check convergence
    if (newAssignments.every((a, i) => a === assignments[i])) break;
    assignments = newAssignments;
    
    // Update centroids
    for (let i = 0; i < k; i++) {
      const clusterPoints = vectors.filter((_, idx) => assignments[idx] === i);
      if (clusterPoints.length > 0) {
        centroids[i] = clusterPoints[0].map((_, d) =>
          clusterPoints.reduce((sum, p) => sum + p[d], 0) / clusterPoints.length
        );
      }
    }
  }
  
  return assignments;
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

function extractTopWords(tweets: Tweet[]): Array<{ text: string; frequency: number }> {
  const wordCounts: Record<string, number> = {};
  
  tweets.forEach(tweet => {
    const words = tweet.text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });
  
  return Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([text, frequency]) => ({ text, frequency }));
}

export async function processTweets(rawData: any[]): Promise<AnalysisResults> {
  console.log("Starting tweet processing...");
  
  // Parse tweets from uploaded data
  const tweets: Tweet[] = rawData.map((item, idx) => ({
    id: item.id || `tweet-${idx}`,
    text: item.text || item.tweet || item.content || "",
  })).filter(t => t.text.length > 0);
  
  console.log(`Processing ${tweets.length} tweets`);
  
  // Step 1: Generate embeddings using SBERT
  console.log("Loading SBERT model...");
  const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
    { device: "webgpu" }
  );
  
  console.log("Generating embeddings...");
  const texts = tweets.map(t => t.text);
  const embeddings = await embedder(texts, { pooling: "mean", normalize: true });
  const embeddingArrays = embeddings.tolist() as number[][];
  
  tweets.forEach((tweet, i) => {
    tweet.embedding = embeddingArrays[i];
  });
  
  // Step 2: Clustering
  console.log("Performing K-Means clustering...");
  const k = Math.min(5, Math.max(3, Math.floor(tweets.length / 50)));
  const clusterAssignments = kMeans(embeddingArrays, k);
  
  tweets.forEach((tweet, i) => {
    tweet.cluster = clusterAssignments[i];
  });
  
  // Step 3: Sentiment Analysis
  console.log("Loading sentiment analysis model...");
  const sentimentAnalyzer = await pipeline(
    "sentiment-analysis",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
  );
  
  console.log("Analyzing sentiment...");
  const sentimentResults = await sentimentAnalyzer(texts);
  
  tweets.forEach((tweet, i) => {
    const result = sentimentResults[i] as any;
    tweet.sentiment = result.label.toLowerCase() === "positive" ? "positive" : "negative";
    tweet.sentimentScore = result.score;
    
    // Add neutral category for scores close to 0.5
    if (Math.abs(result.score - 0.5) < 0.15) {
      tweet.sentiment = "neutral";
    }
  });
  
  // Step 4: Build cluster data
  const clusters: ClusterData[] = [];
  for (let i = 0; i < k; i++) {
    const clusterTweets = tweets.filter(t => t.cluster === i);
    const keywords = extractTopWords(clusterTweets).slice(0, 5).map(w => w.text);
    const avgSentiment = clusterTweets.reduce((sum, t) => 
      sum + (t.sentiment === "positive" ? 1 : t.sentiment === "negative" ? -1 : 0), 0
    ) / clusterTweets.length;
    
    clusters.push({
      id: i,
      tweets: clusterTweets,
      keywords,
      avgSentiment
    });
  }
  
  // Step 5: Calculate sentiment distribution
  const sentimentDistribution = {
    positive: tweets.filter(t => t.sentiment === "positive").length,
    negative: tweets.filter(t => t.sentiment === "negative").length,
    neutral: tweets.filter(t => t.sentiment === "neutral").length,
  };
  
  // Step 6: Extract top words
  const topWords = extractTopWords(tweets);
  
  // Step 7: Generate trend data (mock timeline based on sentiment)
  const trends = [
    { date: "Week 1", positive: sentimentDistribution.positive * 0.15, negative: sentimentDistribution.negative * 0.15, neutral: sentimentDistribution.neutral * 0.15 },
    { date: "Week 2", positive: sentimentDistribution.positive * 0.20, negative: sentimentDistribution.negative * 0.18, neutral: sentimentDistribution.neutral * 0.19 },
    { date: "Week 3", positive: sentimentDistribution.positive * 0.30, negative: sentimentDistribution.negative * 0.28, neutral: sentimentDistribution.neutral * 0.29 },
    { date: "Week 4", positive: sentimentDistribution.positive * 0.35, negative: sentimentDistribution.negative * 0.39, neutral: sentimentDistribution.neutral * 0.37 },
  ];
  
  console.log("Processing complete!");
  
  return {
    tweets,
    clusters,
    sentimentDistribution,
    topWords,
    trends
  };
}
