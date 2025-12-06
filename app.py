from flask import Flask, redirect, render_template, url_for, session, flash, request
import os, pickle
import numpy as np
import pandas as pd

app = Flask(__name__)

app.secret_key = "You-are-My-key"
with open("MODELS/model.pkl", "rb") as f:
    model = pickle.load(f)
    
with open("MODELS/model2.pkl", "rb") as f:
    model2 = pickle.load(f)

@app.route("/home")
def home():
    return render_template('base.html')


@app.route("/", methods = ["GET", "POST"])
def feedback(): 
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        messradius_mean = request.form.get("messradius_mean")
        
        return render_template("thankyou.html", name = username.title())

    return render_template("base.html")


@app.route("/thankyou")
def thankyou():
    return render_template('thankyou.html')


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




# -----------------------heart disease------------------------
@app.route("/predict", methods = ["POST"])
def predict():
    age = request.form['age']
    sex = request.form['sex']
    cp = request.form['cp']
    trestbps = request.form['trestbps']
    chol = request.form['chol']
    fbs = request.form['fbs']
    restecg = request.form['restecg']
    thalach = request.form['thalach']
    exang = request.form['exang']
    oldpeak = request.form['oldpeak']
    slope = request.form['slope']
    ca = request.form['ca']
    thal = request.form['thal']

   
    user_input = np.array([
        float(age), float(sex), float(cp), float(trestbps), float(chol),
        float(fbs), float(restecg), float(thalach), float(exang),
        float(oldpeak), float(slope), float(ca), float(thal)
    ])
   
    reshaped = user_input.reshape(1, -1)

  
    prediction = model.predict(reshaped)

   
    if prediction[0] == 1:
        result = "The person is in danger!"
    else:
        result = "The person is safe."

    return render_template("result.html", prediction_text = result)



# ---------------------cancer-----------------

@app.route("/predict2", methods = ["POST"])
def predict2():
    radius_mean = float(request.form['radius_mean'])
    area_mean = float(request.form['area_mean'])
    concavity_mean = float(request.form['concavity_mean'])
    concave_points_mean = float(request.form['concave_points_mean'])
    texture_se = float(request.form['texture_se'])
    radius_worst = float(request.form['radius_worst'])
    texture_worst = float(request.form['texture_worst'])
    perimeter_worst = float(request.form['perimeter_worst'])
    area_worst = float(request.form['area_worst'])
    compactness_worst = float(request.form['compactness_worst'])
    concavity_worst = float(request.form['concavity_worst'])
    concave_points_worst = float(request.form['concave_points_worst'])

    
    user_input1 = np.array([[radius_mean, area_mean, concavity_mean, concave_points_mean,texture_se, radius_worst, texture_worst, perimeter_worst,area_worst, compactness_worst, concavity_worst,concave_points_worst]])

   
    reshaped = user_input1.reshape(1, -1)

  
    prediction = model2.predict(reshaped)

    prediction = model2.predict(user_input1)[0]

    result = "Malignant (Cancer Positive)" if prediction == 1 else "Benign (Cancer Negative)"

    return render_template("result.html", prediction_text = result)
    


if __name__ == "__main__":
    app.run(debug = True)
