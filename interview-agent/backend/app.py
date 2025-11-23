import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
from prompts import ROLE_PROMPTS, FEEDBACK_PROMPT
from flask_cors import CORS

# Load environment variables
load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_KEY:
    raise RuntimeError("OPENAI_API_KEY not found in .env")

# OpenAI Client
client = OpenAI(api_key=OPENAI_KEY)

# Flask setup
app = Flask(__name__)
CORS(app)   # IMPORTANT for frontend React

# In-memory sessions
sessions = {}

@app.route('/start', methods=['POST'])
def start():
    data = request.json
    role = data.get('role', 'software_engineer')

    session_id = data.get('session_id') or str(len(sessions) + 1)

    sessions[session_id] = {
        "role": role,
        "qa": [],
        "question_idx": 0
    }

    first_q = ROLE_PROMPTS[role]["questions"][0]
    return jsonify({
        "session_id": session_id,
        "question": first_q
    })

@app.route('/answer', methods=['POST'])
def answer():
    data = request.json
    session_id = data["session_id"]
    user_answer = data.get("answer", "")

    sess = sessions.get(session_id)
    if not sess:
        return jsonify({"error": "Invalid session"}), 400

    # Save the Q&A
    sess["qa"].append({
        "question": ROLE_PROMPTS[sess["role"]]["questions"][sess["question_idx"]],
        "answer": user_answer
    })

    # Build follow-up prompt
    follow_template = ROLE_PROMPTS[sess["role"]]["follow_up_template"]
    prompt = follow_template.format(answer=user_answer)

    # Generate follow-up using OpenAI
    follow_resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an interviewer."},
            {"role": "user", "content": prompt}
        ]
    )

    follow_up = follow_resp.choices[0].message.content.strip()

    # Move to next question index
    sess["question_idx"] += 1

    # If interview completed → send feedback
    if sess["question_idx"] >= len(ROLE_PROMPTS[sess["role"]]["questions"]):

        fb_prompt = FEEDBACK_PROMPT.format(
            role=sess["role"],
            qa=sess["qa"]
        )

        fb_resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert interview coach."},
                {"role": "user", "content": fb_prompt}
            ]
        )

        feedback = fb_resp.choices[0].message.content.strip()

        return jsonify({
            "done": True,
            "feedback": feedback
        })

    # Otherwise → only send follow-up
    return jsonify({
        "done": False,
        "follow_up": follow_up,
        "ask_next": True   # frontend should then call /next
    })

@app.route('/next', methods=['POST'])
def next_question():
    data = request.json
    session_id = data["session_id"]

    sess = sessions.get(session_id)
    if not sess:
        return jsonify({"error": "Invalid session"}), 400

    next_q = ROLE_PROMPTS[sess["role"]]["questions"][sess["question_idx"]]

    return jsonify({
        "next_question": next_q
    })


if __name__ == "__main__":
    app.run(debug=True)
