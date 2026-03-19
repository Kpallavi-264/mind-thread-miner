# Mind Thread Miner

Clustering and sentiment analysis platform for depression-related Twitter conversations.

This project combines semantic text processing, unsupervised clustering, sentiment mapping, and an interactive dashboard to identify key mental-health discussion themes and community concerns.

## Research Context

Project title:
Clustering and Sentiment Analysis of Depression-Related Conversations on Twitter Using Sentence-BERT: Identifying Key Themes and Community Concerns

Institution:
SRM Institute of Science and Technology

Team:
- K Pallavi
- Khushi
- Preeti Singh 
- Vaishnavi

## Objectives

- Discover major conversation themes in depression-related tweets using clustering.
- Map sentiment distribution (positive, negative, neutral) across themes.
- Visualize trend patterns and topic-level emotional dynamics.
- Provide interpretable insights useful for mental-health research and outreach planning.

## Tech Stack

Frontend:
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Recharts

Backend:
- Flask + Flask-CORS
- pandas, numpy
- scikit-learn
- sentence-transformers (with TF-IDF fallback when unavailable)

## Project Structure

mind-thread-miner/
- src/                        React frontend
- Backend/                    Flask backend
- Backend/app.py              API server
- Backend/analysis.py         parsing, cleaning, sentiment scoring, trend building
- Backend/ml_models.py        embeddings, clustering, keywords, projection
- Backend/data/               input datasets

## How It Works

1. User uploads CSV or JSON from the frontend.
2. Frontend sends file to backend endpoint /api/upload.
3. Backend pipeline:
	 - reads and cleans text
	 - computes embeddings
	 - clusters tweets
	 - scores sentiment
	 - extracts keywords and trend buckets
4. Backend returns analysis JSON.
5. Dashboard renders clusters, sentiment, keywords, and trend visualizations.

## Quick Start

### 1) Clone

```bash
git clone https://github.com/Kpallavi-264/mind-thread-miner.git
cd mind-thread-miner
```

### 2) Run Backend

```bash
cd Backend
pip install -r requirements.txt
python app.py
```

Backend URLs:
- Health: http://127.0.0.1:5001/api/health
- Sample response: http://127.0.0.1:5001/api/sample

### 3) Run Frontend

Open a new terminal:

```bash
cd mind-thread-miner
npm install
npm run dev
```

Frontend URL:
- http://localhost:8080

## API Endpoints

- GET /api/health
	- Returns service health status.

- GET /api/sample
	- Returns a sample analysis payload.

- POST /api/upload
	- Accepts multipart form-data with key file.
	- Supported formats: .csv, .json, .txt
	- Returns analysis payload with:
		- tweets
		- clusters
		- sentimentDistribution
		- topWords
		- trends

## Dataset Format

Recommended text columns:
- clean_text (best)
- or text, tweet, content, message, post, body, comment

Example CSV:

```csv
post_text,label,clean_text
"I feel tired today",1,"i feel tired today"
"Therapy is helping me",0,"therapy is helping me"
```

## Current Experimental Snapshot

From the latest internal evaluation sample (n=1200):

- Cluster configuration used for theme reporting: k=5
- Cluster sizes: {0: 1017, 1: 39, 2: 50, 3: 77, 4: 17}
- Overall sentiment counts:
	- positive: 113
	- negative: 39
	- neutral: 1048

Example identified themes:
- general daily emotional expression
- positive/social support language
- explicit mental-health discussion
- daily stress and coping fluctuation
- help-seeking and behavior-change tips

## Ethical and Privacy Notes

- Use outputs for aggregate-level research, not individual diagnosis.
- Avoid storing or publishing personally identifying user data.
- Report trends and theme-level findings in anonymized form.
- Interpret results with bias awareness (platform effects, language bias, sampling bias).

## Troubleshooting

- Backend import error:
	- Reinstall backend requirements.
	- Ensure commands run inside Backend folder.

- Frontend cannot reach backend:
	- Confirm backend is running on port 5001.
	- Confirm POST /api/upload is accessible.

- Slow first run:
	- Embedding setup may take time on first execution depending on environment.

## Future Improvements

- Add richer transformer sentiment model with batch inference.
- Add persistent experiment logging and run metadata.
- Add exportable report artifacts (charts + metrics tables).
- Add deployment profiles for cloud hosting.
