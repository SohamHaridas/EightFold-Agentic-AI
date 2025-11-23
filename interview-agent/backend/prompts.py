ROLE_PROMPTS = {
    'sales': {
        'questions': [
            'Tell me about yourself and your sales experience.',
            'Describe a time you handled a tough objection.',
            'How do you prioritize leads?'
        ],
        'follow_up_template': 'User answered: "{answer}". Ask a concise follow-up that probes for specific metrics, impact, or methods. Keep it short.'
    },
    'software_engineer': {
        'questions': [
            'Tell me about a technical project you are proud of.',
            'Explain how you design for scalability.',
            'Describe a bug you fixed and how you diagnosed it.'
        ],
        'follow_up_template': 'User answered: "{answer}". Ask a specific follow-up that probes technical decisions or trade-offs.'
    },
    'retail': {
        'questions': [
            'Why do you want to work in retail?',
            'How do you handle difficult customers?',
            'Describe teamwork in a busy store.'
        ],
        'follow_up_template': 'User answered: "{answer}". Ask a brief follow-up that asks for concrete examples or outcomes.'
    }
}

FEEDBACK_PROMPT = (
    'You are an expert coach. Evaluate the following Q&A for role {role}. '
    'For each Q&A, give a short score out of 10 for: clarity, relevance, confidence. '
    'Then, give 3 specific suggestions to improve overall interview performance. Q&A: {qa}'
)
