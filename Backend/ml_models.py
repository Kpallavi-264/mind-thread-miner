from __future__ import annotations

import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

_SBERT_MODEL = None


def _load_sbert_model():
    global _SBERT_MODEL
    if _SBERT_MODEL is None:
        from sentence_transformers import SentenceTransformer

        _SBERT_MODEL = SentenceTransformer("all-MiniLM-L6-v2")
    return _SBERT_MODEL


def compute_embeddings(texts: list[str]) -> np.ndarray:
    if not texts:
        return np.empty((0, 2), dtype=np.float32)

    try:
        model = _load_sbert_model()
        embeddings = model.encode(texts, show_progress_bar=False, normalize_embeddings=True)
        return np.asarray(embeddings, dtype=np.float32)
    except Exception:
        # Fallback keeps the API usable even when model download is unavailable.
        vectorizer = TfidfVectorizer(stop_words="english", max_features=384, ngram_range=(1, 2))
        fallback = vectorizer.fit_transform(texts).toarray()
        return np.asarray(fallback, dtype=np.float32)


def choose_cluster_count(num_samples: int) -> int:
    if num_samples <= 1:
        return 1
    return max(2, min(8, int(np.sqrt(num_samples / 2)) + 1))


def cluster_embeddings(embeddings: np.ndarray, n_clusters: int | None = None) -> np.ndarray:
    sample_count = int(embeddings.shape[0])
    if sample_count == 0:
        return np.array([], dtype=int)
    if sample_count == 1:
        return np.zeros(1, dtype=int)

    if n_clusters is None:
        n_clusters = choose_cluster_count(sample_count)
    n_clusters = max(1, min(n_clusters, sample_count - 1))

    if n_clusters == 1:
        return np.zeros(sample_count, dtype=int)

    model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    return model.fit_predict(embeddings).astype(int)


def project_embeddings_2d(embeddings: np.ndarray) -> list[list[float]]:
    sample_count = int(embeddings.shape[0])
    if sample_count == 0:
        return []

    if embeddings.shape[1] < 2 or sample_count < 3:
        points = []
        for index in range(sample_count):
            x_val = float(embeddings[index][0]) if embeddings.shape[1] >= 1 else float(index)
            y_val = float(embeddings[index][1]) if embeddings.shape[1] >= 2 else 0.0
            points.append([round(x_val, 5), round(y_val, 5)])
        return points

    pca = PCA(n_components=2, random_state=42)
    coords = pca.fit_transform(embeddings)

    x = coords[:, 0]
    y = coords[:, 1]
    x_norm = (x - x.min()) / (x.max() - x.min() + 1e-9) * 100.0
    y_norm = (y - y.min()) / (y.max() - y.min() + 1e-9) * 100.0

    return [[round(float(x_norm[i]), 4), round(float(y_norm[i]), 4)] for i in range(sample_count)]


def extract_cluster_keywords(texts: list[str], labels: np.ndarray, top_n: int = 6) -> dict[int, list[str]]:
    if len(texts) != len(labels):
        raise ValueError("Texts and labels must have the same length.")

    result: dict[int, list[str]] = {}
    unique_labels = sorted({int(label) for label in labels.tolist()})

    for label in unique_labels:
        cluster_texts = [texts[idx] for idx, value in enumerate(labels.tolist()) if int(value) == label]
        if not cluster_texts:
            result[label] = []
            continue

        vectorizer = CountVectorizer(stop_words="english", max_features=1000)
        matrix = vectorizer.fit_transform(cluster_texts)
        terms = np.array(vectorizer.get_feature_names_out())
        frequencies = np.asarray(matrix.sum(axis=0)).ravel()

        top_indices = frequencies.argsort()[::-1][:top_n]
        keywords = [str(terms[idx]) for idx in top_indices if frequencies[idx] > 0]
        result[label] = keywords

    return result


def extract_top_words(texts: list[str], top_n: int = 25) -> list[dict[str, int]]:
    if not texts:
        return []

    vectorizer = CountVectorizer(stop_words="english", max_features=2000)
    matrix = vectorizer.fit_transform(texts)
    terms = np.array(vectorizer.get_feature_names_out())
    frequencies = np.asarray(matrix.sum(axis=0)).ravel()
    top_indices = frequencies.argsort()[::-1][:top_n]

    return [
        {"text": str(terms[idx]), "frequency": int(frequencies[idx])}
        for idx in top_indices
        if frequencies[idx] > 0
    ]
