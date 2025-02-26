// components/chat.tsx
'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from 'ai/react';
import { useState, useEffect, useRef, useCallback } from 'react';

type SpeechRecognition = typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;
import useSWR, { useSWRConfig } from 'swr';

import { ChatHeader } from '@/components/chat-header';
import type { Vote } from '@/lib/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';

import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { VisibilityType } from './visibility-selector';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { toast } from 'sonner';
import { Mic, MicOff, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [voiceModal, setVoiceModal] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [transcript, setTranscript] = useState('');

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate('/api/history');
    },
    onError: () => {
      toast.error('An error occurred, please try again!');
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(`/api/vote?chatId=${id}`, fetcher);
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
  
        if (recognitionRef.current) {
          recognitionRef.current.onresult = debounce((event: SpeechRecognitionEvent) => {
            let finalTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
            setTranscript(finalTranscript);
            setInput(finalTranscript);
          }, 500); // Adjust debounce time as needed
        }
  
        recognitionRef.current.onerror = () => {
          toast.error('Voice recognition error!');
          setIsListening(false);
          setVoiceModal(false);
        };
  
        recognitionRef.current.onend = () => {
          const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
          toast.success(`🎤 Voice chat ended. Duration: ${duration} seconds`);
          setIsListening(false);
          setVoiceModal(false);
          sendToGemini(transcript);
        };
      }
    }
  
    return () => {
      recognitionRef.current?.stop(); // Cleanup on unmount
    };
  }, [startTime, transcript]);
  

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }
  
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setVoiceModal(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setStartTime(Date.now());
      setVoiceModal(true);
    }
  }, [isListening]);  

  const sendToGemini = async (query: string) => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      append({ role: 'assistant', content: data.reply });
    } catch (error) {
      toast.error('Gemini AI response failed. ' + (error as Error).message);
    }
  };  

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          isLoading={isLoading}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <>
              <MultimodalInput
                chatId={id}
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                stop={stop}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={messages}
                setMessages={setMessages}
                append={append}
              />
              {/* Mic Button for Voice Input */}
              {/* <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-full transition ${
                  isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button> */}
            </>
          )}
        </form>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />

      {/* Voice Chat Modal */}
      {voiceModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-xl text-center relative w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <button onClick={toggleListening} className="absolute top-2 right-2 text-gray-500">
              <X size={20} />
            </button>
            <p className="text-lg font-semibold mb-4">Listening...</p>
            <motion.div
              className="w-20 h-20 bg-blue-500 rounded-full animate-ping"
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
            <p className="text-gray-500 text-sm">{transcript}</p>
          </motion.div>
        </div>
      )}
    </>
  );
}
