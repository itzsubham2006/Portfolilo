from flask import Flask, redirect, render_template, url_for, session, flash, request
import os

app = Flask(__name__)

app.secret_key = "You-are-My-key"


@app.route("/home")
def home():
    return render_template('base.html')


@app.route("/", methods = ["GET", "POST"])
def feedback(): 
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        message = request.form.get("message")
        
        return render_template("thankyou.html")

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


if __name__ == "__main__":
    app.run(debug = True)
