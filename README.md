# Portfolio Website - ML Prediction System

A personal portfolio with real Machine Learning powered prediction system.

## Features
- **Heart Disease Prediction** - Uses Random Forest ML model
- **Cancer Prediction** - Uses Random Forest ML model
- Real Python backend with trained .pkl models

## Files Structure
```
Portfolilo/
├── index.html          # Main portfolio
├── pages/
│   ├── system.html  
│   ├── heart-disease.html
│   └── cancer.html
├── css/style.css
├── js/script.js
├── api/
│   └── app.py       # Flask API server
├── models/          # ML model files (.pkl)
├── requirements.txt
└── vercel.json     # Vercel config
```

## How to Run Locally

### Option 1: Test Training Script (to generate .pkl files)
```bash
cd api
python train_models.py
```

### Option 2: Run API Server
```bash
# First install requirements
pip install -r requirements.txt

# Train models
python train_models.py

# Then run API
python api/app.py
```

The API will run at http://localhost:5000

### Test the API:
```bash
# Test heart prediction
curl -X POST http://localhost:5000/api/heart \
  -H "Content-Type: application/json" \
  -d '{"age":55,"sex":1,"cp":1,"trestbps":140,"chol":240,"fbs":0,"restecg":1,"thalach":150,"exang":1,"oldpeak":1,"slope":1,"ca":0,"thal":2}'
```

## How to Deploy on Vercel

### 1. Push to GitHub
Create a GitHub repo and push all files.

### 2. Deploy on Vercel
1. Go to vercel.com
2. Import your GitHub repo
3. Vercel will auto-detect Flask
4. Deploy!

### Or use Vercel CLI:
```bash
npm i -g vercel
vercel
```

## How It Works
- Frontend is pure HTML/CSS/JS (no server needed for main portfolio)
- Prediction forms call `/api/heart` and `/api/cancer` endpoints
- API uses trained Python ML models (.pkl files)
- Returns JSON with prediction + confidence

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask (Python)
- **ML**: Scikit-learn, Random Forest
- **Hosting**: Vercel

## Note
Before deploying on Vercel, you need to:
1. Generate the .pkl model files (run `python api/train_models.py`)
2. Commit the models folder to git
3. Deploy