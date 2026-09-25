# 🤖 AI-Assisted Task & Habit Tracker

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&duration=3000&pause=1000&color=00C2FF&center=true&vCenter=true&width=700&lines=Plan+Smarter.+Build+Better+Habits.;Your+Personal+Productivity+Dashboard;AI-Assisted+Productivity+%7C+Task+Management+%7C+Habit+Tracking" alt="Typing Animation" />
</p>

<p align="center">
  <strong>A modern productivity web application for managing tasks, tracking habits, monitoring progress, and receiving contextual productivity guidance through a smart AI Coach simulator.</strong>
</p>

<p align="center">
  <a href="YOUR-NETLIFY-LINK">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-00C2FF?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo"/>
  </a>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/LocalStorage-000000?style=for-the-badge&logo=googlechrome&logoColor=white" alt="LocalStorage"/>
</p>

---

## ✨ Overview

**AI-Assisted Task & Habit Tracker** is a responsive, browser-based productivity application designed to help users organize daily tasks, build consistent habits, and understand their productivity through a centralized dashboard.

The application combines:

* 📋 Task Management
* 🔥 Habit Tracking
* 🤖 Contextual AI Coach Simulator
* 📊 Productivity Analytics
* 💾 Local Data Persistence
* 🌙 Dark / Light Mode
* 📤 Data Export & Import
* 📱 Responsive User Interface

The project is built entirely with **HTML, Tailwind CSS, and Vanilla JavaScript**, making it lightweight, fast, and easy to deploy.

---

## 🎯 Project Goals

The main goal of this project is to create a practical productivity system that goes beyond a simple to-do list.

The application focuses on three core areas:

> **Organize → Track → Improve**

Users can organize their responsibilities, track daily habits, analyze their progress, and receive contextual productivity suggestions.

---

## 🚀 Key Features

### 📋 Smart Task Management

* ➕ Add new tasks
* ✏️ Edit existing tasks
* ✅ Mark tasks as completed
* 🗑️ Delete tasks
* 🔎 Search tasks
* 🎯 Priority levels:

  * 🔴 High
  * 🟡 Medium
  * 🟢 Low
* 📅 Due-date support
* 📝 Task descriptions
* 🔃 Sorting and filtering
* 📌 Active / Completed / All task views

---

### 🔥 Habit Tracker

Build consistency by tracking habits over time.

Features include:

* ➕ Create habits
* ✏️ Edit habits
* 🗑️ Delete habits
* ✅ Daily check-in
* 🔥 Current streak
* 🏆 Best streak
* 📅 Completion history
* 📈 Weekly progress
* 🎯 Habit completion tracking

The streak system uses actual completion dates rather than simply counting clicks.

---

### 🤖 AI Coach — Smart Productivity Simulator

The application includes a contextual **AI Coach simulator** designed to provide productivity guidance based on the user's current tasks and habits.

The AI Coach can respond to prompts such as:

* 💬 "What should I do first?"
* 💬 "How are my habits doing?"
* 💬 "Give me a plan for today."
* 💬 "I'm feeling unproductive."
* 💬 "What tasks should I prioritize?"

The assistant analyzes available task and habit information and generates rule-based contextual suggestions.

> **Note:** This project does not connect to an external AI API. The AI Coach is intentionally implemented as a smart productivity simulator using JavaScript-based contextual logic.

---

### 📊 Productivity Analytics

The dashboard provides useful productivity insights, including:

* 📈 Task completion rate
* ✅ Total completed tasks
* 📋 Total active tasks
* 🔥 Current habit streak
* 📊 Overall progress
* 🎯 Habit completion statistics

This helps users understand their productivity instead of simply storing tasks.

---

### 🌙 Dark & Light Mode

A polished theme system allows users to switch between:

* 🌙 Dark Mode
* ☀️ Light Mode

The selected theme is saved locally so the interface remains consistent between sessions.

---

### 💾 LocalStorage Persistence

All important application data is stored locally in the browser using **LocalStorage**.

Stored information includes:

* Tasks
* Habits
* Completion history
* Streak information
* Theme preference
* Application settings

No backend or database is required.

---

### 📤 Export & Import

Users can:

* 📦 Export their productivity data as JSON
* 📥 Import previously exported data
* 🧹 Clear application data with confirmation

This provides a simple way to back up and restore personal productivity data.

---

## 🎨 UI / UX Highlights

The interface was designed with a modern productivity-dashboard aesthetic.

### Design principles

* 🖥️ Responsive desktop layout
* 📱 Mobile-friendly interface
* 🎨 Modern dark/light UI
* 🧊 Glass-style cards
* ✨ Subtle animations
* 🎯 Clear visual hierarchy
* 🔔 Toast notifications
* 🧩 Reusable UI components
* ♿ Accessibility-conscious interactions
* 🕹️ Interactive hover and click states

The goal was to make productivity management feel **simple, visual, and engaging**.

---

## 🧠 Application Structure

```text
                    ┌────────────────────────┐
                    │        Dashboard       │
                    └───────────┬────────────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
        ┌──────────┐       ┌──────────┐       ┌──────────┐
        │  Tasks   │       │  Habits  │       │Analytics │
        └────┬─────┘       └────┬─────┘       └──────────┘
             │                  │
             └──────────┬───────┘
                        ▼
                ┌───────────────┐
                │   AI Coach    │
                │   Simulator   │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │  LocalStorage │
                └───────────────┘
```

---

## 🛠️ Tech Stack

| Technology             | Purpose                          |
| ---------------------- | -------------------------------- |
| **HTML5**              | Application structure            |
| **Tailwind CSS**       | Modern responsive styling        |
| **Vanilla JavaScript** | Application logic & interactions |
| **LocalStorage API**   | Client-side data persistence     |
| **Netlify**            | Deployment & hosting             |

---

## 📁 Project Structure

```text
ai-task-habit-tracker/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

### File Responsibilities

**`index.html`**
Contains the application's main structure and UI components.

**`style.css`**
Contains custom styling, animations, responsive adjustments, and visual enhancements.

**`script.js`**
Handles task management, habit tracking, streak calculations, AI Coach logic, analytics, LocalStorage, theme management, import/export, and UI interactions.

**`README.md`**
Project documentation and setup information.

---

## ⚙️ How It Works

### 1️⃣ Create Tasks

Users can create tasks with:

* Title
* Description
* Priority
* Due date

### 2️⃣ Manage Tasks

Tasks can be searched, filtered, sorted, completed, edited, or deleted.

### 3️⃣ Track Habits

Users create habits and check them off each day.

### 4️⃣ Build Streaks

The application calculates streaks from actual completion dates.

### 5️⃣ Analyze Progress

Dashboard analytics summarize task and habit performance.

### 6️⃣ Ask the AI Coach

Users can interact with the productivity assistant to receive contextual suggestions based on their current data.

---

## 🌐 Live Demo

### 🚀 Try the Application

**[Open Live Demo →](YOUR-NETLIFY-LINK)**

> The application runs completely in the browser and does not require account creation, backend services, or API keys.

---

## 💻 Run Locally

Clone the repository:

```bash
git clone https://github.com/Majortarif/ai-task-habit-tracker.git
```

Open the project folder:

```bash
cd ai-task-habit-tracker
```

Then open:

```text
index.html
```

in your browser.

No build process or package installation is required.

---

## 📱 Responsive Design

The application is designed to work across:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

The layout automatically adapts to different screen sizes.

---

## 🔐 Privacy & Data

This application does not require a backend database.

User productivity data is stored locally inside the browser using **LocalStorage**.

Therefore:

* No account is required
* No server database is required
* No external AI API is required
* No API key is required

---

## 🔮 Future Improvements

Possible future versions could include:

* 🧠 Real AI API integration
* ☁️ Cloud synchronization
* 👤 User authentication
* 📱 Progressive Web App support
* 🔔 Browser notifications
* 📅 Calendar integration
* 📊 Advanced productivity analytics
* 🏆 Gamification and achievement system
* 🌐 Cross-device synchronization

---

## 🧪 Development Focus

This project was developed to practice and demonstrate:

* Frontend development
* JavaScript application logic
* UI/UX design
* State management
* Local data persistence
* Date-based logic
* Responsive web design
* Productivity-system design
* AI-assisted application concepts

---

## 👨‍💻 Author

### Tariful Hoque

**CSE Graduate | Machine Learning & AI | Data Science | UI/UX**

📧 **Email:** [tarifulhoque347@gmail.com](mailto:tarifulhoque347@gmail.com)

💼 **LinkedIn:**
https://www.linkedin.com/in/tariful-hoque-582321259

🌐 **Portfolio:**
https://tarifulhoqueportfoloi.netlify.app/

🐙 **GitHub:**
https://github.com/Majortarif

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐.

It helps support the project and encourages further development.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=footer&text=Built%20with%20HTML%20%7C%20Tailwind%20%7C%20JavaScript&fontSize=18&fontColor=ffffff" alt="Footer Animation"/>
</p>

<p align="center">
  <strong>🚀 Plan Smarter. Track Better. Build Consistency.</strong>
</p>
