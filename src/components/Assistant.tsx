import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Sparkles, User, Bot, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface AssistantProps {
  profile: UserProfile;
}

export default function Assistant({ profile }: AssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi ${profile.name}! I'm your OCC Health Assistant. I'm here to support your journey with healthy tips, encouragement, and guidance. How can I help you today?`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `
              You are the OCC (Obesity Care Centre) Personal Wellness Coach. 
              User Profile: 
              - Name: ${profile.name}
              - Main Goal: ${profile.mainGoal}
              - Fitness Level: ${profile.fitnessLevel}
              - Current Weight: ${profile.weight}kg
              - Height: ${profile.height}cm
              - Dietary Preference: ${profile.dietaryPreference}
              
              Your Mission:
              - Help ${profile.name} build sustainable healthy habits.
              - Provide personalized advice aligned with their goal of ${profile.mainGoal}.
              - Be extremely supportive, encouraging, and positive.
              - Use a "wellness coach" tone: professional yet warm and motivating.
              
              Rules:
              - Focus on small, achievable daily wins.
              - DO NOT shame the user.
              - DO NOT promote extreme dieting or unsafe practices.
              - ALWAYS include a brief disclaimer: "I am an AI wellness coach, not a medical professional. Please consult a doctor for medical advice."
              - Keep responses concise, structured with bullet points where helpful, and mobile-friendly.
              
              User Question: ${input}
            ` }]
          }
        ],
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I'm sorry, I couldn't process that. How else can I help?",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having a bit of trouble connecting right now. Please try again in a moment!",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Mock voice recognition
      setTimeout(() => {
        setInput("How can I improve my water intake?");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] bg-gray-50 max-w-lg mx-auto">
      <header className="bg-white p-4 border-b border-gray-100 flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900">OCC Assistant</h1>
          <div className="flex items-center text-[10px] text-green-500 font-bold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />
            Online & Supportive
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex items-start space-x-2 text-xs text-blue-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>I provide wellness support, not medical diagnosis. Always consult a professional for health concerns.</p>
        </div>

        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-start space-x-2 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse space-x-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-blue-600" : "bg-white border border-gray-100"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-600" />}
            </div>
            <div className={cn(
              "p-4 rounded-3xl text-sm leading-relaxed",
              msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm"
            )}>
              <div className="markdown-body prose prose-sm max-w-none prose-p:my-0 prose-ul:my-1">
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-gray-100 flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 pb-24">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMic}
            className={cn(
              "p-3 rounded-2xl transition-colors",
              isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            <Mic className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="w-full p-4 bg-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-12"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
