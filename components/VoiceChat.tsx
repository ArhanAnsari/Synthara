// components/VoiceChat.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Waveform from "./Waveform";
import { Mic, MicOff, X } from "lucide-react";
import { useSpeechSynthesis } from 'react-speech-kit';

type SpeechRecognition = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;

const VoiceChat = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [generatingResponse, setGeneratingResponse] = useState(false)  // Loading state during AI processing
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
       recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Changed to true for continuous listening
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript((prevTranscript) => prevTranscript + transcript);
             fetchAIResponse(transcript); // Fetch response for each final result
          } else {
            interimTranscript += transcript;
          }
        }
        setTranscript(interimTranscript)
      };



      recognitionRef.current.onend = () => {
       setIsListening(false);
         if (transcript) {
            fetchAIResponse(transcript);
         }
      };

    }
  }, []);

  const startListening = () => {
        setTranscript(""); // Clear previous transcript
        setResponse(""); // Clear any previous responses
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();

        }
    };


  const fetchAIResponse = async (text: string) => {
    setGeneratingResponse(true); // Show a loading indicator
    try {
        const res = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: text }),
        });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.generatedContent);
      speak({ text: data.generatedContent }); // AI speaks the response

    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("There was a problem getting a response. Please try again.");
        } finally {
            setGeneratingResponse(false); // Hide loading indicator after response is received or error
        }
  };


  return (
      <div className="voice-chat relative"> {/* Added relative for positioning */}
          <AnimatePresence>
              {isListening && (
                  <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur"
                  >
                      <motion.div
                          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center relative w-96"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                      >
                          <button
                              onClick={stopListening}
                              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                          >
                              <X size={20}/>
                          </button>
                          <Waveform/>
                          <p className="font-semibold text-lg mt-4">Listening...</p>
                          <p className="mt-2 text-gray-500 whitespace-pre-wrap">{transcript}</p>
                      </motion.div>
                  </motion.div>
              )}
          </AnimatePresence>

          <div
              className="chat-box fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              {/* Input field (removed for now, as it's handled in the modal) */}
              <button
                  className={`mic-btn absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full text-2xl focus:outline-none ${
                      isListening ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  onClick={isListening ? stopListening : startListening}
              >
                  {isListening ? <MicOff size={20} strokeWidth={1.5}/> : <Mic size={20} strokeWidth={1.5}/>}
              </button>
          </div>

          {/* AI Response Display */}
          {response && (
                <div className="response-box fixed bottom-20 left-4 bg-green-500/50 px-4 py-2 rounded-lg text-white shadow-md">
                  {response}
                </div>
            )}

        {generatingResponse && ( // Display loading indicator while waiting for response
            <div className="fixed bottom-20 left-4 bg-gray-200 px-4 py-2 rounded-lg shadow-md text-gray-700">
                Generating...
            </div>
        )}
      </div>
  );
};


export default VoiceChat;