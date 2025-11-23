import React, { useState } from 'react';

export default function ChatBox({ messages, onSend }) {
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.from}`}>
            <div>{m.text}</div>
          </div>
        ))}
      </div>

      <div className="input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your answer"
        />
        <button onClick={submit}>Send</button>
      </div>
    </div>
  );
}
