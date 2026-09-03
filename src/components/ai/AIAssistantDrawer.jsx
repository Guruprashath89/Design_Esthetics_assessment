import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ChatWindow from './ChatWindow';

export default function AIAssistantDrawer({ isOpen, onClose, destinationContext, initialPrompt }) {
  const drawerRef = useRef(null);

  // Escape key closes drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Trap body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="AURA AI Assistant Panel"
    >
      {/* Backdrop — click to close */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 animate-fade-in"
        style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
      />

      {/* Slide-in Drawer Panel — Full screen on mobile h-[100dvh] */}
      <div
        ref={drawerRef}
        className="absolute inset-y-0 right-0 w-full sm:w-[540px] md:w-[600px] h-full max-h-[100dvh] bg-aura-dark border-l border-aura-border shadow-modal flex flex-col z-10 animate-slide-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2.5 text-aura-muted hover:text-aura-sand bg-white/5 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-aura-terracotta min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close AI Assistant"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Chat Window fills the entire drawer */}
        <div className="flex-1 overflow-hidden pt-1">
          <ChatWindow
            key={initialPrompt + (destinationContext?.id || '')}
            destinationContext={destinationContext}
            initialPrompt={initialPrompt}
          />
        </div>
      </div>
    </div>
  );
}
