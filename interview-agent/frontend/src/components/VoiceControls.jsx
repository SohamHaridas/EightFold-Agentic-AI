import React, { useEffect, useRef, useState } from 'react';

export default function VoiceControls({ onResult }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onerror = (e) => {
      console.error('Voice recognition error:', e.error);
      setListening(false);
    };

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript.trim();
      if (text.length > 1) {
        onResult(text);
      } else {
        console.log('Ignored empty or too short voice input:', text);
      }
    };

    recognitionRef.current = recognition;
  }, [onResult]);

  const handleClick = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
  };

  return (
    <div className="voice-controls">
      <button onClick={handleClick} style={{ background: listening ? '#f00' : '#ff8c42' }}>
        {listening ? 'Listening...' : '🎤 Speak Answer'}
      </button>
    </div>
  );
}
