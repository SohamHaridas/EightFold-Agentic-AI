import React, { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import VoiceControls from './components/VoiceControls';
import api from './utils/api';

export default function App() {
  const [sessionId, setSessionId] = useState(null);
  const [role, setRole] = useState('software_engineer');
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState(null); // For final evaluation
  const [interviewDone, setInterviewDone] = useState(false);

  // Start a new interview session
  const startSession = async () => {
    const res = await api.post('/start', { role });
    setSessionId(res.data.session_id);
    setMessages([{ from: 'bot', text: res.data.question }]);
    setFeedback(null);
    setInterviewDone(false);
  };

  // Handle user answering question
  const sendAnswer = async (answer) => {
    if (!sessionId || interviewDone) return;

    // Show user's message
    setMessages(prev => [...prev, { from: 'user', text: answer }]);

    // Send answer to backend
    const res = await api.post('/answer', {
      session_id: sessionId,
      answer
    });

    // If interview is done → show feedback
    if (res.data.done) {
      setFeedback(res.data.feedback);
      setInterviewDone(true);
      setMessages(prev => [...prev, { from: 'bot', text: "Interview completed. Check evaluation below." }]);
      return;
    }

    // Otherwise → Show follow-up
    setMessages(prev => [...prev, { from: 'bot', text: res.data.follow_up }]);

    // Fetch the next question after delay
    setTimeout(async () => {
      const next = await api.post('/next', { session_id });
      setMessages(prev => [...prev, { from: 'bot', text: next.data.next_question }]);
    }, 1500);
  };

  // Start interview when role changes
  useEffect(() => {
    startSession();
  }, [role]);

  return (
    <div className="app">
      <header>
        <h1>Interview Agent</h1>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="software_engineer">Software Engineer</option>
          <option value="sales">Sales</option>
          <option value="retail">Retail Associate</option>
        </select>
      </header>

      <main>
        <ChatBox messages={messages} onSend={sendAnswer} />
        <VoiceControls onResult={sendAnswer} />

        {/* Feedback Panel */}
        {interviewDone && feedback && (
          <div className="feedback-panel">
            <h2>Evaluation</h2>
            {/* Assuming feedback is plain text with scores and suggestions */}
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
              {feedback}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
