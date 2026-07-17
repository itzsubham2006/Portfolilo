from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pickle
import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

app = FastAPI(title="Subham Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists("models"):
    os.makedirs("models")

def create_models():
    print("Training ML models...")

    print("Training Heart Disease model...")
    heart_df = pd.read_csv("data_sets/heart.csv", encoding='utf-8-sig')
    heart_df.columns = heart_df.columns.str.strip()

    X_heart = heart_df.drop('target', axis=1)
    y_heart = heart_df['target']

    heart_clf = RandomForestClassifier(n_estimators=150, random_state=42, max_depth=10)
    heart_clf.fit(X_heart, y_heart)

    with open("models/model.pkl", "wb") as f:
        pickle.dump(heart_clf, f)
    print(f"Heart model done! Accuracy: {heart_clf.score(X_heart, y_heart)*100:.1f}%")

    print("Training Cancer model...")
    cancer_df = pd.read_csv("data_sets/breast_cancer_data.csv", encoding='utf-8-sig')
    cancer_df.columns = cancer_df.columns.str.strip().str.replace(' ', '_')

    if 'id' in cancer_df.columns:
        cancer_df = cancer_df.drop('id', axis=1)

    cancer_df['diagnosis'] = cancer_df['diagnosis'].map({'M': 1, 'B': 0})

    features = ['radius_mean', 'area_mean', 'concavity_mean', 'concave_points_mean',
                 'texture_se', 'radius_worst', 'texture_worst', 'perimeter_worst',
                 'area_worst', 'compactness_worst', 'concavity_worst', 'concave_points_worst']

    X_cancer = cancer_df[features]
    y_cancer = cancer_df['diagnosis']

    cancer_clf = RandomForestClassifier(n_estimators=150, random_state=42, max_depth=10)
    cancer_clf.fit(X_cancer, y_cancer)

    with open("models/model2.pkl", "wb") as f:
        pickle.dump({'model': cancer_clf, 'features': features}, f)
    print(f"Cancer model done! Accuracy: {cancer_clf.score(X_cancer, y_cancer)*100:.1f}%")

    print("All models ready!")

FORCE_RECREATE = False
if FORCE_RECREATE or not os.path.exists("models/model.pkl") or not os.path.exists("models/model2.pkl"):
    create_models()

with open("models/model.pkl", "rb") as f:
    model = pickle.load(f)

with open("models/model2.pkl", "rb") as f:
    cancer_data = pickle.load(f)

if isinstance(cancer_data, dict):
    model2 = cancer_data['model']
    cancer_features = cancer_data['features']
else:
    model2 = cancer_data
    cancer_features = ['radius_mean', 'area_mean', 'concavity_mean', 'concave_points_mean',
                       'texture_se', 'radius_worst', 'texture_worst', 'perimeter_worst',
                       'area_worst', 'compactness_worst', 'concavity_worst', 'concave_points_worst']

@app.post("/predict")
async def predict(
    age: float = Form(...),
    sex: float = Form(...),
    cp: float = Form(...),
    trestbps: float = Form(...),
    chol: float = Form(...),
    fbs: float = Form(...),
    restecg: float = Form(...),
    thalach: float = Form(...),
    exang: float = Form(...),
    oldpeak: float = Form(...),
    slope: float = Form(...),
    ca: float = Form(...),
    thal: float = Form(...)
):
    columns = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
    user_input = pd.DataFrame([[age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]], columns=columns)

    prediction = model.predict(user_input)[0]
    prob = model.predict_proba(user_input)[0]
    confidence = round(max(prob) * 100, 1)

    result = "Heart Disease Risk Detected" if prediction == 1 else "Heart is Healthy"
    return JSONResponse({"result": result, "confidence": confidence, "model_name": "Heart Disease"})

@app.post("/predict2")
async def predict2(
    radius_mean: float = Form(...),
    area_mean: float = Form(...),
    concavity_mean: float = Form(...),
    concave_points_mean: float = Form(...),
    texture_se: float = Form(...),
    radius_worst: float = Form(...),
    texture_worst: float = Form(...),
    perimeter_worst: float = Form(...),
    area_worst: float = Form(...),
    compactness_worst: float = Form(...),
    concavity_worst: float = Form(...),
    concave_points_worst: float = Form(...)
):
    user_input = pd.DataFrame([[radius_mean, area_mean, concavity_mean, concave_points_mean,
                                texture_se, radius_worst, texture_worst, perimeter_worst,
                                area_worst, compactness_worst, concavity_worst, concave_points_worst]],
                              columns=cancer_features)

    prediction = model2.predict(user_input)[0]
    prob = model2.predict_proba(user_input)[0]
    confidence = round(max(prob) * 100, 1)

    result = "Malignant - Cancer Positive" if prediction == 1 else "Benign - No Cancer"
    return JSONResponse({"result": result, "confidence": confidence, "model_name": "Cancer"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
