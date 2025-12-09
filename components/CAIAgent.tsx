import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Shared';
import { generateCAIResponse } from '../services/geminiService';
import { ChatMessage, User } from '../types';
import { storageService } from '../services/storageService';

interface CAIAgentProps {
  user: User;
}

export const CAIAgent: React.FC<CAIAgentProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load history on mount or user change
  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        const history = await storageService.getChatHistory(user.id);
        if (history.length > 0) {
          setMessages(history);
        } else {
          setMessages([{ 
            id: 'init', 
            role: 'model', 
            text: 'Hello! I am here to help you navigate WySider. How can I assist you today?', 
            timestamp: Date.now() 
          }]);
        }
        setIsInitialized(true);
      }
    };
    loadHistory();
  }, [user.id]);

  // Save history whenever messages change
  useEffect(() => {
    if (isInitialized && user && messages.length > 0) {
      storageService.saveChatHistory(user.id, messages);
    }
  }, [messages, user, isInitialized]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass chat history for context
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await generateCAIResponse(userMsg.text, history);
      
      const modelMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: responseText || "I'm thinking...", 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-electric-blue to-deep-purple rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-105 transition-transform z-50"
      >
        <Icons.Chat />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-vision-dark border border-gray-700 rounded-2xl shadow-2xl z-50 flex flex-col animate-slide-up">
      <div className="p-4 border-b border-gray-800 bg-vision-gray rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-bold text-white">WySider Support</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
          <Icons.X />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
              msg.role === 'user' 
                ? 'bg-electric-blue text-white rounded-br-none' 
                : 'bg-gray-800 text-gray-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-400 rounded-bl-none animate-pulse">
               Typing...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 bg-vision-gray rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask WySider..."
            className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-electric-blue"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-electric-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <Icons.Send />
          </button>
        </div>
      </div>
    </div>
  );
};