import io
import json
import re
from typing import Any

import pandas as pd

TEXT_COLUMN_CANDIDATES = [
    "clean_text",
    "text",
    "tweet",
    "content",
    "message",
    "post",
    "body",
    "comment",
    "description",
]

ID_COLUMN_CANDIDATES = ["id", "tweet_id", "post_id", "message_id"]
DATE_COLUMN_CANDIDATES = ["created_at", "date", "timestamp", "time"]

POSITIVE_WORDS = {
    "hope",
    "better",
    "improve",
    "support",
    "help",
    "healing",
    "recover",
    "safe",
    "grateful",
    "calm",
    "love",
    "good",
    "progress",
}

NEGATIVE_WORDS = {
    "depressed",
    "depression",
    "sad",
    "hopeless",
    "anxious",
    "anxiety",
    "alone",
    "isolated",
    "tired",
    "empty",
    "cry",
    "panic",
    "hurt",
    "pain",
    "stress",
    "stressed",
}


def parse_uploaded_file(file_storage: Any) -> pd.DataFrame:
    filename = (file_storage.filename or "").lower()
    raw_bytes = file_storage.read()
    if not raw_bytes:
        raise ValueError("Uploaded file is empty.")

    text = raw_bytes.decode("utf-8", errors="ignore")

    if filename.endswith(".json"):
        data = json.loads(text)
        if isinstance(data, dict):
            if "data" in data and isinstance(data["data"], list):
                data = data["data"]
            else:
                data = [data]
        if not isinstance(data, list):
            raise ValueError("JSON file must contain a list of tweet objects.")
        df = pd.DataFrame(data)
    elif filename.endswith(".csv") or filename.endswith(".txt"):
        df = pd.read_csv(io.StringIO(text))
    else:
        raise ValueError("Only CSV, TXT, and JSON files are supported.")

    if df.empty:
        raise ValueError("No rows found in uploaded file.")

    return df


def _pick_text_column(df: pd.DataFrame) -> str:
    lowered = {str(col).strip().lower(): col for col in df.columns}
    for candidate in TEXT_COLUMN_CANDIDATES:
        if candidate in lowered:
            return str(lowered[candidate])

    object_columns = [col for col in df.columns if df[col].dtype == "object"]
    if not object_columns:
        raise ValueError("No text-like column found in uploaded file.")

    best_col = max(
        object_columns,
        key=lambda col: df[col].astype(str).str.len().mean(),
    )
    return str(best_col)


def _pick_optional_column(df: pd.DataFrame, candidates: list[str]) -> str | None:
    lowered = {str(col).strip().lower(): col for col in df.columns}
    for candidate in candidates:
        if candidate in lowered:
            return str(lowered[candidate])
    return None


def clean_text(text: str) -> str:
    cleaned = text.lower()
    cleaned = re.sub(r"http\S+|www\S+", " ", cleaned)
    cleaned = re.sub(r"@\w+", " ", cleaned)
    cleaned = re.sub(r"#", "", cleaned)
    cleaned = re.sub(r"[^a-z\s]", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def prepare_tweets(df: pd.DataFrame, max_tweets: int = 1200) -> list[dict[str, Any]]:
    text_col = _pick_text_column(df)
    id_col = _pick_optional_column(df, ID_COLUMN_CANDIDATES)
    date_col = _pick_optional_column(df, DATE_COLUMN_CANDIDATES)

    records: list[dict[str, Any]] = []
    for idx, row in df.iterrows():
        raw_text = "" if pd.isna(row[text_col]) else str(row[text_col]).strip()
        if not raw_text:
            continue

        cleaned = clean_text(raw_text)
        if len(cleaned.split()) < 2:
            continue

        tweet_id = str(row[id_col]) if id_col and not pd.isna(row[id_col]) else f"tweet-{idx + 1}"
        date_value = None
        if date_col and not pd.isna(row[date_col]):
            parsed = pd.to_datetime(row[date_col], errors="coerce")
            if pd.notna(parsed):
                date_value = parsed.strftime("%Y-%m-%d")

        records.append(
            {
                "id": tweet_id,
                "text": raw_text,
                "cleaned_text": cleaned,
                "date": date_value,
            }
        )

        if len(records) >= max_tweets:
            break

    if not records:
        raise ValueError("No usable tweet text found after preprocessing.")

    return records


def score_sentiments(texts: list[str]) -> tuple[list[str], list[float]]:
    labels: list[str] = []
    scores: list[float] = []

    for text in texts:
        words = text.split()
        if not words:
            labels.append("neutral")
            scores.append(0.5)
            continue

        pos_hits = sum(1 for word in words if word in POSITIVE_WORDS)
        neg_hits = sum(1 for word in words if word in NEGATIVE_WORDS)
        delta = pos_hits - neg_hits

        if delta > 0:
            label = "positive"
        elif delta < 0:
            label = "negative"
        else:
            label = "neutral"

        confidence = 0.5 + min(abs(delta), 4) * 0.1
        confidence = min(max(confidence, 0.5), 0.95)

        labels.append(label)
        scores.append(round(confidence, 3))

    return labels, scores


def build_trends(sentiments: list[str], dates: list[str | None], buckets: int = 4) -> list[dict[str, Any]]:
    dated_rows = [
        {"date": dates[idx], "sentiment": sentiments[idx]}
        for idx in range(len(sentiments))
        if dates[idx] is not None
    ]

    if dated_rows:
        trend_df = pd.DataFrame(dated_rows)
        trend_df["date"] = pd.to_datetime(trend_df["date"])
        trend_df["bucket"] = trend_df["date"].dt.to_period("W").astype(str)
        grouped = trend_df.groupby(["bucket", "sentiment"]).size().unstack(fill_value=0)

        trends = []
        for bucket, row in grouped.sort_index().tail(buckets).iterrows():
            trends.append(
                {
                    "date": bucket,
                    "positive": int(row.get("positive", 0)),
                    "negative": int(row.get("negative", 0)),
                    "neutral": int(row.get("neutral", 0)),
                }
            )
        return trends

    total = len(sentiments)
    if total == 0:
        return []

    chunk_size = max(1, total // buckets)
    trends: list[dict[str, Any]] = []
    for idx in range(buckets):
        start = idx * chunk_size
        end = total if idx == buckets - 1 else min(total, start + chunk_size)
        chunk = sentiments[start:end]
        if not chunk:
            continue
        trends.append(
            {
                "date": f"Phase {idx + 1}",
                "positive": chunk.count("positive"),
                "negative": chunk.count("negative"),
                "neutral": chunk.count("neutral"),
            }
        )
    return trends
