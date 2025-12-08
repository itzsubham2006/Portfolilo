# My Portfolio Website

This is a personal portfolio website built using **Flask** and **Jinja2 templates**. The website showcases my skills, goals, projects, and provides a contact/feedback option for visitors. It also includes a **SQL database** to store feedback submitted by users.  

---

## Features

- **Home Page:** Overview of me and my portfolio.
- **Skills Section:** Highlighting technical skills and expertise.
- **Goals Section:** Personal and professional goals.
- **Projects Section:** Showcasing projects including a **Prediction System** project.
- **Contact / Feedback Form:** Allows users to submit feedback, which is stored in a SQL database.
- **Responsive Design:** Works well on both desktop and mobile devices.
- **Jinja2 Template Inheritance:** Easy to maintain and reuse templates.

---

## Technology Stack

- **Backend:** Flask (Python)
- **Frontend:** HTML, CSS, JavaScript
- **Template Engine:** Jinja2
- **Database:** SQL (SQLite/MySQL)
- **Hosting/Server:** Local development using `flask run`

---

## Folder Structure
PORT_FOLIO/
│
├── __pycache__/
│
├── data_sets/
│   ├── breast_cancer_data.csv
│   ├── diabetes.csv
│   ├── heart.csv
│   └── Placement_Dataset.csv
│
├── MODELS/
│   ├── breast_cancer_sys.ipynb
│   ├── heart_disease.ipynb
│   ├── placement_sys.ipynb
│   ├── model.pkl
│   └── model2.pkl
│
├── static/
│   ├── css/
│   │   ├── style.css
│   │   ├── style1.css
│   │   └── style2.css
│   │
│   ├── images/
│   │   ├── AI_tools.jpeg
│   │   ├── AI.jpeg
│   │   ├── cv.pdf
│   │   ├── genai.jpeg
│   │   ├── heart.jpeg
│   │   ├── image copy 3.png
│   │   ├── image.png
│   │   ├── logo2.png
│   │   ├── me.png
│   │   ├── multiple.jpeg
│   │   └── portfolio.png
│   │
│   └── js/
│       └── script.js
│
├── templates/
│   ├── cancer.html
│   ├── heart_disease.html
│   ├── index.html
│   ├── result.html
│   ├── system.html
│   └── thankyou.html
│
├── venv/
│
├── .env
└── .gitignore



---

## Installation

1. **Clone the repository:**

git clone https://github.com/your-username/portfolio-website.git
cd portfolio-website


2. **Create and activate a virtual environment:**

python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate



3. **Install dependencies:**

pip install -r requirements.txt


4. **Run the Flask app:**

flask run

