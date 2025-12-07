from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import pickle
import numpy as np
import os
from dotenv import load_dotenv

# ------------------ LS ------------------
load_dotenv()  

FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "you-are-my-key") 
DB_TYPE = os.getenv("DB_TYPE", "sqlite")  
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

# 
app = Flask(__name__, static_url_path='/static', static_folder='static')
app.secret_key = FLASK_SECRET_KEY


if DB_TYPE == "mysql":
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
else:
    
    db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), "feedback.db")
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ------------------ DATABASE MODEL ------------------
class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)

with app.app_context():
    db.create_all()

# ------------------ LOAD ML MODELS ------------------
with open("MODELS/model.pkl", "rb") as f:
    model = pickle.load(f)

with open("MODELS/model2.pkl", "rb") as f:
    model2 = pickle.load(f)

# ------------------ ROUTES ------------------
@app.route("/home")
def home():
    return render_template('index.html')

@app.route("/", methods=["GET", "POST"])
def feedback(): 
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        message = request.form.get("message")

        new_feedback = Feedback(name=username, email=email, message=message)
        db.session.add(new_feedback)
        db.session.commit()

        return render_template("thankyou.html", name=username.title())

    return render_template("index.html")

@app.route("/system")
def system():
    return render_template("system.html")

@app.route("/heart")
def heart():
    return render_template("heart_disease.html")

@app.route("/cancer")
def cancer():
    return render_template("cancer.html")

@app.route("/result")
def result():
    return render_template("result.html")

# -------- HEART DISEASE MODEL --------
@app.route("/predict", methods=["POST"])
def predict():
    user_input = np.array([
        float(request.form['age']),
        float(request.form['sex']),
        float(request.form['cp']),
        float(request.form['trestbps']),
        float(request.form['chol']),
        float(request.form['fbs']),
        float(request.form['restecg']),
        float(request.form['thalach']),
        float(request.form['exang']),
        float(request.form['oldpeak']),
        float(request.form['slope']),
        float(request.form['ca']),
        float(request.form['thal'])
    ]).reshape(1, -1)

    prediction = model.predict(user_input)
    result = "The person is in danger!" if prediction[0] == 1 else "The person is safe."

    return render_template("result.html", prediction_text=result, model_name="Heart Disease")

# -------- CANCER MODEL --------
@app.route("/predict2", methods=["POST"])
def predict2():
    user_input1 = np.array([[
        float(request.form['radius_mean']),
        float(request.form['area_mean']),
        float(request.form['concavity_mean']),
        float(request.form['concave_points_mean']),
        float(request.form['texture_se']),
        float(request.form['radius_worst']),
        float(request.form['texture_worst']),
        float(request.form['perimeter_worst']),
        float(request.form['area_worst']),
        float(request.form['compactness_worst']),
        float(request.form['concavity_worst']),
        float(request.form['concave_points_worst'])
    ]]).reshape(1, -1)

    prediction = model2.predict(user_input1)[0]
    result = "Malignant (Cancer Positive)" if prediction == 1 else "Benign (Cancer Negative)"

    return render_template("result.html", prediction_text=result, model_name="Cancer")


if __name__ == "__main__":
    app.run(debug=True)
