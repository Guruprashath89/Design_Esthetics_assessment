import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import DestinationPage from './pages/DestinationPage';
import AIAssistantDrawer from './components/ai/AIAssistantDrawer';

export default function App() {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiContext, setAiContext] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleOpenAI = () => {
    setAiContext(null);
    setAiPrompt('');
    setAiDrawerOpen(true);
  };

  const handleOpenAIWithPrompt = (promptText) => {
    setAiContext(null);
    setAiPrompt(promptText);
    setAiDrawerOpen(true);
  };

  const handleOpenAIWithContext = (destContext) => {
    setAiContext(destContext);
    setAiPrompt(`Plan a 5-day trip to ${destContext.city}`);
    setAiDrawerOpen(true);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-aura-dark text-aura-sand selection:bg-aura-terracotta selection:text-white">
        {/* Sticky Glassmorphic Navbar */}
        <Navbar onOpenAI={handleOpenAI} />

        {/* Main Content Viewport */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onOpenAI={handleOpenAI}
                  onOpenAIWithPrompt={handleOpenAIWithPrompt}
                />
              }
            />
            <Route path="/explore" element={<ExplorePage />} />
            <Route
              path="/destination/:id"
              element={
                <DestinationPage onOpenAIWithContext={handleOpenAIWithContext} />
              }
            />
          </Routes>
        </main>

        {/* Refined Footer */}
        <Footer onOpenAI={handleOpenAI} />

        {/* Global AI Assistant Sliding Panel */}
        <AIAssistantDrawer
          isOpen={aiDrawerOpen}
          onClose={() => setAiDrawerOpen(false)}
          destinationContext={aiContext}
          initialPrompt={aiPrompt}
        />
      </div>
    </Router>
  );
}
