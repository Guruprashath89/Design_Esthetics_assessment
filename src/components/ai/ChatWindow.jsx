import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, Bot, User } from 'lucide-react';
import { askAuraAssistant } from '../../services/geminiService';
import ItineraryView from './ItineraryView';
import { parseItinerary } from '../../utils/itineraryParser';

export default function ChatWindow({ destinationContext, initialPrompt = '' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedPrompts = [
    "Plan a 5-day trip to Bangkok",
    "Plan a 5-day trip itinerary",
    "What are the top culinary experiences?",
    "When is the best time of year to visit?",
    "How do I make the journey more relaxed?"
  ];

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query || !query.trim() || loading) return;

    const isItineraryReq =
      query.toLowerCase().includes("plan") ||
      query.toLowerCase().includes("itinerary") ||
      (query.toLowerCase().includes("day") && (query.toLowerCase().includes("trip") || query.toLowerCase().includes("journey")));

    const userMsg = { sender: 'user', text: query, timestamp: new Date() };
    
    // Create history snapshot of previous turns
    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text
    }));

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await askAuraAssistant({
        prompt: query,
        history,
        destinationContext,
        mode: isItineraryReq ? 'itinerary' : 'chat'
      });

      setLoading(false);

      const parsedItinerary = res.data || parseItinerary(res.reply);

      if (parsedItinerary) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'aura',
            text: `Here is your bespoke ${parsedItinerary.duration}-day journey for ${parsedItinerary.destination}:`,
            itineraryData: parsedItinerary,
            timestamp: new Date()
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'aura',
            text: res.reply || "AURA is here to help curate your journey. What would you like to explore?",
            timestamp: new Date()
          }
        ]);
      }
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'aura',
          text: "AURA is taking a moment. The travel assistant isn't available right now. Please try again in a moment.",
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full bg-aura-dark text-aura-sand overflow-hidden">
      {/* Header Bar */}
      <div className="p-3.5 sm:p-4 border-b border-aura-border flex items-center justify-between bg-aura-card/90 flex-shrink-0 pr-14 sm:pr-16">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-aura-terracotta/20 border border-aura-terracotta flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-aura-terracotta" />
          </div>
          <div>
            <h3 className="font-serif text-base sm:text-lg text-aura-sand font-medium leading-tight">AURA Travel Curator</h3>
            <p className="text-[10px] sm:text-[11px] text-aura-muted">
              {destinationContext ? `Context: ${destinationContext.city}` : 'Global Travel Architect'}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="text-[11px] sm:text-xs text-aura-muted hover:text-aura-sand flex items-center gap-1 transition-colors px-2 py-1 rounded bg-white/5 min-h-[32px]"
            title="Clear Chat Thread"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
        {messages.length === 0 && (
          <div className="py-6 sm:py-8 text-center space-y-5 sm:space-y-6 max-w-md mx-auto animate-fade-in px-2">
            <div className="w-11 h-11 sm:w-12 sm:h-12 mx-auto rounded-full bg-aura-terracotta/15 border border-aura-terracotta/30 flex items-center justify-center text-aura-terracotta">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <h4 className="font-serif text-lg sm:text-xl text-aura-sand">Where shall we venture?</h4>
              <p className="text-xs text-aura-muted leading-relaxed font-sans font-light">
                Ask AURA anything about our 21 destinations, seek advice on seasons and culinary culture, or shape a custom day-by-day itinerary.
              </p>
            </div>

            {/* Suggested Context Prompts */}
            <div className="space-y-2 text-left pt-1">
              <div className="text-[10px] uppercase tracking-widest text-aura-muted font-semibold px-1">
                Suggested Questions
              </div>
              <div className="flex flex-col gap-2">
                {suggestedPrompts.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(promptText)}
                    className="text-left text-xs p-3 rounded-xl bg-aura-card border border-aura-border hover:border-aura-terracotta/40 text-aura-sand/90 hover:text-aura-sand transition-all duration-200 min-h-[44px] flex items-center"
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => {
          const activeItinerary = msg.itineraryData || parseItinerary(msg.text);

          return (
            <div
              key={idx}
              className={`flex gap-2.5 sm:gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-0.5 ${
                  msg.sender === 'user'
                    ? 'bg-aura-terracotta text-white'
                    : 'bg-white/10 text-aura-sand border border-white/10'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed space-y-3 break-words overflow-hidden ${
                  msg.sender === 'user'
                    ? 'bg-aura-terracotta text-white rounded-tr-none max-w-[85%]'
                    : 'bg-aura-card border border-aura-border text-aura-sand/90 rounded-tl-none w-full max-w-full'
                }`}
              >
                {activeItinerary ? (
                  <div className="space-y-3 w-full">
                    <div className="text-xs sm:text-sm font-medium text-aura-sand">
                      Here is your bespoke {activeItinerary.duration}-day journey for {activeItinerary.destination}:
                    </div>
                    <ItineraryView itinerary={activeItinerary} />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 max-w-xl animate-pulse">
            <div className="w-8 h-8 rounded-full bg-aura-card border border-aura-border flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-aura-terracotta animate-spin" />
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-aura-card border border-aura-border text-xs text-aura-muted italic">
              AURA is curating your recommendation...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form — Stably Anchored at Bottom */}
      <div className="p-3 sm:p-4 border-t border-aura-border bg-aura-card/90 flex-shrink-0 pb-safe">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-aura-dark border border-white/15 rounded-full p-1.5 focus-within:border-aura-terracotta/60"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              destinationContext
                ? `Ask about ${destinationContext.city}...`
                : "Ask AURA anything or request an itinerary..."
            }
            className="flex-1 bg-transparent px-3 sm:px-4 text-xs sm:text-sm text-aura-sand placeholder-aura-muted focus:outline-none min-h-[36px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-9 h-9 sm:w-9 sm:h-9 rounded-full bg-aura-terracotta hover:bg-aura-terracotta-dark text-white flex items-center justify-center disabled:opacity-50 transition-colors flex-shrink-0 min-w-[36px] min-h-[36px]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
