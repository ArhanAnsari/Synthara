// hooks/useSpeechRecognition.tsx
import { useState, useEffect } from "react";

// Declare SpeechRecognition for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
  }
}

export const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  let recognition: any;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Your browser does not support speech recognition.");
        return;
      }

      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const last = event.results.length - 1;
        setText(event.results[last][0].transcript);
      };
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setText(""); // Clear previous text
      recognition.start();
    }
  };

  return { text, isListening, startListening };
};
