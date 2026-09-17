// src/App.jsx
// SENTINEL Security Operations Center — App Shell

import React, { useState } from 'react';
import { SocProvider, useSoc } from './context/SocContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import SettingsModal from './components/settings/SettingsModal';

import Overview       from './pages/Overview';
import LiveThreatFeed from './pages/LiveThreatFeed';
import ThreatAnalysis from './pages/ThreatAnalysis';
import AIModel        from './pages/AIModel';
import Analytics      from './pages/Analytics';
import Alerts         from './pages/Alerts';
import ThreatSimulator from './pages/ThreatSimulator';

function SocContent() {
  const { activePage } = useSoc();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'overview':          return <Overview />;
      case 'live-feed':         return <LiveThreatFeed />;
      case 'threat-analysis':   return <ThreatAnalysis />;
      case 'ai-model':          return <AIModel />;
      case 'analytics':         return <Analytics />;
      case 'alerts':            return <Alerts />;
      case 'threat-simulator':  return <ThreatSimulator />;
      default:                  return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c1e] text-[#e8eaf6] flex dot-grid">
      {/* Icon-only sidebar rail — always 72px wide on desktop */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area offset by sidebar width */}
      <div className="lg:pl-[72px] flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-[1400px] mx-auto fade-in-up">
            {renderPage()}
          </div>
        </main>
      </div>

      <SettingsModal />
    </div>
  );
}

export default function App() {
  return (
    <SocProvider>
      <SocContent />
    </SocProvider>
  );
}