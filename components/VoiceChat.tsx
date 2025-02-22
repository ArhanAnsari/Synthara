// components/VoiceChat.tsx
"use client";
import { useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { speakText } from "@/lib/utils";

export default function VoiceChat() {
  const { text, isListening, startListening } = useSpeechRecognition();
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    if (!text) return;
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    if (data.reply) {
      setResponse(data.reply);
      speakText(data.reply); // Convert AI response to speech
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl w-96 mx-auto">
      <h2 className="text-lg font-semibold">🎙️ Voice Chat with Aurora AI</h2>

      <button
        onClick={startListening}
        className={`mt-4 px-4 py-2 rounded ${isListening ? "bg-red-500" : "bg-blue-500"}`}
      >
        {isListening ? "Listening..." : "Start Speaking"}
      </button>

      {text && (
        <>
          <p className="mt-4 text-sm">You: {text}</p>
          <button onClick={handleSend} className="mt-2 bg-green-500 px-3 py-1 rounded">
            Send to AI
          </button>
        </>
      )}

      {response && (
        <p className="mt-4 text-sm text-green-400">Aurora AI: {response}</p>
      )}
    </div>
  );
}
