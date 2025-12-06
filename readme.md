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

portfolio-website/
│
├─ app/
│ ├─ templates/ # Jinja2 HTML templates
│ │ ├─ base.html
│ │ ├─ home.html
│ │ ├─ projects.html
│ │ ├─ contact.html
│ │ └─ feedback.html
│ ├─ static/ # CSS, JS, images
│ │ ├─ style.css
│ │ └─ images/
│ ├─ init.py
│ ├─ routes.py
│ └─ models.py # SQL database models
│
├─ requirements.txt
└─ README.md

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

