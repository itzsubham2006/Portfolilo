from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from jinja2 import Environment, FileSystemLoader
import pickle
import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

app = FastAPI(title="Subham Portfolio")

app.mount("/static", StaticFiles(directory="static"), name="static")

jinja_env = Environment(loader=FileSystemLoader("templates"), cache_size=0)

def render(template_name: str, **kwargs):
    template = jinja_env.get_template(template_name)
    return HTMLResponse(template.render(**kwargs))

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

FORCE_RECREATE = True
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

@app.get("/", response_class=HTMLResponse)
async def home():
    return render("index.html")

@app.get("/system", response_class=HTMLResponse)
async def system():
    return render("system.html")

@app.get("/heart", response_class=HTMLResponse)
async def heart():
    return render("heart_disease.html")

@app.get("/cancer", response_class=HTMLResponse)
async def cancer():
    return render("cancer.html")

@app.post("/predict", response_class=HTMLResponse)
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
    confidence = max(prob) * 100

    result = f"Heart Disease Risk Detected! ({confidence:.1f}% confidence)" if prediction == 1 else f"Heart is Healthy ({confidence:.1f}% confidence)"
    return render("result.html", prediction_text=result, model_name="Heart Disease")

@app.post("/predict2", response_class=HTMLResponse)
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
    confidence = max(prob) * 100

    result = f"Malignant - Cancer Positive! ({confidence:.1f}% confidence)" if prediction == 1 else f"Benign - No Cancer ({confidence:.1f}% confidence)"
    return render("result.html", prediction_text=result, model_name="Cancer")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
