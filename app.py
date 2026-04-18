from flask import Flask, render_template, request
import pickle
import numpy as np
import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

app = Flask(__name__, static_url_path='/static', static_folder='static')


if not os.path.exists("models"):
    os.makedirs("models")

def create_models():
    print("Training ML models with actual datasets...")
    
    # = HEART DISEASE MODEL
    print("Training Heart Disease model...")
    heart_df = pd.read_csv("data_sets/heart.csv", encoding='utf-8-sig')
    
    
    heart_df.columns = heart_df.columns.str.strip()
    
    # Prepare features and target
    X_heart = heart_df.drop('target', axis=1)
    y_heart = heart_df['target']
    
    # Train model
    heart_clf = RandomForestClassifier(n_estimators=150, random_state=42, max_depth=10)
    heart_clf.fit(X_heart, y_heart)
    
    # Save model with feature names
    with open("models/model.pkl", "wb") as f:
        pickle.dump(heart_clf, f)
    print(f"Heart model trained! Accuracy: {heart_clf.score(X_heart, y_heart)*100:.1f}%")
    
    # ===== CANCER MODEL =====
    print("Training Cancer model...")
    cancer_df = pd.read_csv("data_sets/breast_cancer_data.csv", encoding='utf-8-sig')
    
   
    cancer_df.columns = cancer_df.columns.str.strip().str.replace(' ', '_')
    
    
    if 'id' in cancer_df.columns:
        cancer_df = cancer_df.drop('id', axis=1)
    
    # M=1 (Malignant), B=0 (Benign)
    cancer_df['diagnosis'] = cancer_df['diagnosis'].map({'M': 1, 'B': 0})
    
    # Select features that match our form inputs
    features = ['radius_mean', 'area_mean', 'concavity_mean', 'concave_points_mean',
                 'texture_se', 'radius_worst', 'texture_worst', 'perimeter_worst',
                 'area_worst', 'compactness_worst', 'concavity_worst', 'concave_points_worst']
    
    X_cancer = cancer_df[features]
    y_cancer = cancer_df['diagnosis']
    
    # Train model
    cancer_clf = RandomForestClassifier(n_estimators=150, random_state=42, max_depth=10)
    cancer_clf.fit(X_cancer, y_cancer)
    
    # Save model with feature names
    with open("models/model2.pkl", "wb") as f:
        pickle.dump({'model': cancer_clf, 'features': features}, f)
    print(f"Cancer model trained! Accuracy: {cancer_clf.score(X_cancer, y_cancer)*100:.1f}%")
    
    print("All models created successfully!")


FORCE_RECREATE = True  # Set to True to retrain models

if FORCE_RECREATE or not os.path.exists("models/model.pkl") or not os.path.exists("models/model2.pkl"):
    print("Creating ML models from your datasets...")
    create_models()

# Load ML models
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

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/system")
def system():
    return render_template('system.html')

@app.route("/heart")
def heart():
    return render_template('heart_disease.html')

@app.route("/cancer")
def cancer():
    return render_template('cancer.html')

# Heart Disease Prediction
@app.route("/predict", methods=["POST"])
def predict():
    # Get all form values
    form_features = [
        request.form['age'],
        request.form['sex'],
        request.form['cp'],
        request.form['trestbps'],
        request.form['chol'],
        request.form['fbs'],
        request.form['restecg'],
        request.form['thalach'],
        request.form['exang'],
        request.form['oldpeak'],
        request.form['slope'],
        request.form['ca'],
        request.form['thal']
    ]
    
    # Create DataFrame with feature names
    user_input = pd.DataFrame([form_features], columns=['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'])
    user_input = user_input.astype(float)
    
    prediction = model.predict(user_input)[0]
    prob = model.predict_proba(user_input)[0]
    confidence = max(prob) * 100
    
    result = f"Heart Disease Risk Detected! ({confidence:.1f}% confidence)" if prediction == 1 else f"Heart is Healthy ({confidence:.1f}% confidence)"
    
    return render_template("result.html", prediction_text=result, model_name="Heart Disease")

# Cancer Prediction
@app.route("/predict2", methods=["POST"])
def predict2():
    # Get features from form
    form_features = [
        request.form['radius_mean'],
        request.form['area_mean'],
        request.form['concavity_mean'],
        request.form['concave_points_mean'],
        request.form['texture_se'],
        request.form['radius_worst'],
        request.form['texture_worst'],
        request.form['perimeter_worst'],
        request.form['area_worst'],
        request.form['compactness_worst'],
        request.form['concavity_worst'],
        request.form['concave_points_worst']
    ]
    
    user_input = pd.DataFrame([form_features], columns=cancer_features)
    user_input = user_input.astype(float)
    
    prediction = model2.predict(user_input)[0]
    prob = model2.predict_proba(user_input)[0]
    confidence = max(prob) * 100
    
    result = f"Malignant - Cancer Positive! ({confidence:.1f}% confidence)" if prediction == 1 else f"Benign - No Cancer ({confidence:.1f}% confidence)"
    
    return render_template("result.html", prediction_text=result, model_name="Cancer")

if __name__ == "__main__":
    app.run(debug=True)