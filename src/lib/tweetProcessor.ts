import type { AnalysisResults } from "@/contexts/AnalysisContext";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "http://127.0.0.1:5001";

function isAnalysisResults(payload: unknown): payload is AnalysisResults {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const data = payload as Partial<AnalysisResults>;
  return (
    Array.isArray(data.tweets) &&
    Array.isArray(data.clusters) &&
    typeof data.sentimentDistribution === "object" &&
    Array.isArray(data.topWords) &&
    Array.isArray(data.trends)
  );
}

export async function processTweetFile(file: File): Promise<AnalysisResults> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const errorMessage =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as Record<string, unknown>).error)
        : `Backend request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  if (!isAnalysisResults(payload)) {
    throw new Error("Backend response format is invalid.");
  }

  return payload;
}
