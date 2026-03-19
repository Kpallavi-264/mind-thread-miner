from __future__ import annotations

import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from analysis import build_trends, parse_uploaded_file, prepare_tweets, score_sentiments
from ml_models import (
    cluster_embeddings,
    compute_embeddings,
    extract_cluster_keywords,
    extract_top_words,
    project_embeddings_2d,
)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

MAX_TWEETS = 1200


@app.get("/api/health")
def health_check():
    return jsonify({"status": "ok", "service": "mind-thread-miner-backend"})


def _build_results(tweets: list[dict]) -> dict:
    cleaned_texts = [tweet["cleaned_text"] for tweet in tweets]
    dates = [tweet.get("date") for tweet in tweets]

    embeddings = compute_embeddings(cleaned_texts)
    labels = cluster_embeddings(embeddings)
    projection = project_embeddings_2d(embeddings)
    sentiments, scores = score_sentiments(cleaned_texts)
    cluster_keywords = extract_cluster_keywords(cleaned_texts, labels)
    top_words = extract_top_words(cleaned_texts)
    trends = build_trends(sentiments, dates)

    for idx, tweet in enumerate(tweets):
        tweet["cluster"] = int(labels[idx])
        tweet["sentiment"] = sentiments[idx]
        tweet["sentimentScore"] = float(scores[idx])
        tweet["embedding"] = projection[idx] if idx < len(projection) else [0.0, 0.0]

    sentiment_distribution = {
        "positive": sentiments.count("positive"),
        "negative": sentiments.count("negative"),
        "neutral": sentiments.count("neutral"),
    }

    clusters = []
    unique_labels = sorted({int(value) for value in labels.tolist()})
    for label in unique_labels:
        cluster_tweets = [tweet for tweet in tweets if tweet["cluster"] == label]
        if cluster_tweets:
            avg_sentiment = sum(
                1 if tweet["sentiment"] == "positive" else -1 if tweet["sentiment"] == "negative" else 0
                for tweet in cluster_tweets
            ) / len(cluster_tweets)
        else:
            avg_sentiment = 0

        clusters.append(
            {
                "id": int(label),
                "tweets": [
                    {
                        "id": tweet["id"],
                        "text": tweet["text"],
                        "embedding": tweet["embedding"],
                        "cluster": tweet["cluster"],
                        "sentiment": tweet["sentiment"],
                        "sentimentScore": tweet["sentimentScore"],
                    }
                    for tweet in cluster_tweets
                ],
                "keywords": cluster_keywords.get(int(label), []),
                "avgSentiment": round(float(avg_sentiment), 4),
            }
        )

    public_tweets = [
        {
            "id": tweet["id"],
            "text": tweet["text"],
            "embedding": tweet["embedding"],
            "cluster": tweet["cluster"],
            "sentiment": tweet["sentiment"],
            "sentimentScore": tweet["sentimentScore"],
        }
        for tweet in tweets
    ]

    return {
        "tweets": public_tweets,
        "clusters": clusters,
        "sentimentDistribution": sentiment_distribution,
        "topWords": top_words,
        "trends": trends,
    }


@app.post("/api/upload")
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded. Use form-data key 'file'."}), 400

    uploaded_file = request.files["file"]
    if uploaded_file.filename == "":
        return jsonify({"error": "File name is empty."}), 400

    try:
        dataframe = parse_uploaded_file(uploaded_file)
        tweets = prepare_tweets(dataframe, max_tweets=MAX_TWEETS)
        results = _build_results(tweets)
        return jsonify(results)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": f"Unexpected server error: {error}"}), 500


@app.get("/api/sample")
def sample_results():
    sample = [
        {"id": "s1", "text": "I feel alone and exhausted lately.", "cleaned_text": "i feel alone and exhausted lately", "date": None},
        {"id": "s2", "text": "Therapy is helping me cope better.", "cleaned_text": "therapy is helping me cope better", "date": None},
        {"id": "s3", "text": "My anxiety spikes at night and I cannot sleep.", "cleaned_text": "my anxiety spikes at night and i cannot sleep", "date": None},
        {"id": "s4", "text": "Support from friends is making recovery easier.", "cleaned_text": "support from friends is making recovery easier", "date": None},
    ]
    return jsonify(_build_results(sample))


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
