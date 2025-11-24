# Interview Agent

A web-based AI Interview Agent built with **React + Vite** (frontend) and **Flask + OpenAI API** (backend).
It allows users to:

* Conduct mock interviews for different roles (Software Engineer, Sales, Retail Associate)
* Ask follow-up questions dynamically
* Provide post-interview feedback with score cards and suggestions
* Interact via chat or voice input

---

## Features

* **Role Selection:** Choose between different roles for tailored questions.
* **Dynamic Follow-Up:** The AI asks context-aware follow-up questions.
* **Voice Input:** Speak your answers using your microphone.
* **Evaluation Panel:** Shows Clarity, Relevance, and Confidence scores along with actionable suggestions.
* **Modern UI:** Chat interface with colored bubbles, smooth scrolling, and responsive layout.

---

## Tech Stack

* **Frontend:** React 18, Vite, CSS
* **Backend:** Flask, Python 3.10+, OpenAI API, Flask-CORS
* **Deployment:** Localhost / can be extended for cloud deployment

---

## Project Structure

```
interview-agent/
  backend/
    app.py
    prompts.py
    .env
    venv/
  frontend/
    index.html
    vite.config.js
    package.json
    src/
      main.jsx
      App.jsx
      index.css
      styles.css
      components/
        ChatBox.jsx
        VoiceControls.jsx
      utils/
        api.js
```

---

## Setup Instructions

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install flask openai python-dotenv flask-cors
```

Create a `.env` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

Run the backend:

```bash
python app.py
```

---

### 2. Frontend

```bash
cd frontend
npm install
npm install axios
npm run dev
```

Frontend runs at: [http://localhost:5173](http://localhost:5173)

---

## Usage

1. Open the frontend in your browser.
2. Select the desired role.
3. Start answering questions either by typing or using the microphone.
4. After finishing all questions, view the evaluation panel for scores and suggestions.

---

## Notes

* Ensure the backend is running before starting the frontend.
* Microphone permissions are required for voice input.
* This project uses the **new OpenAI Python SDK**.

---

## License

MIT License
