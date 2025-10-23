
import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { GreenHatIcon } from '../../constants';
import { streamChatResponse } from '../../services/geminiService';
import type { ChatMessage } from '../../types';

const HatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', parts: [{ text: input }] }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await streamChatResponse(newMessages, input);
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].parts[0].text = fullResponse;
            return updated;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting right now." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-neon-green text-dark-charcoal p-4 rounded-full shadow-glow-green hover:scale-110 transition-transform z-50"
        aria-label="Open HatBot"
      >
        <ChatBubbleLeftRightIcon className="h-8 w-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-full max-w-sm h-[600px] bg-gray-900/70 backdrop-blur-lg border border-neon-green/30 rounded-2xl shadow-2xl shadow-neon-green/20 flex flex-col font-sans z-50">
      <div className="flex items-center justify-between p-4 border-b border-neon-green/20">
        <div className="flex items-center gap-3">
          <GreenHatIcon className="w-8 h-8 text-neon-green" />
          <h3 className="font-bold text-white text-lg">HatBot</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-neon-green text-dark-charcoal rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'}`}>
               <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1].role === 'user' &&(
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-xl bg-gray-700 text-white rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-neon-green/20">
        <div className="flex items-center bg-gray-800 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent p-3 text-white placeholder-gray-500 focus:outline-none"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-3 text-neon-green disabled:text-gray-600">
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HatBot;
