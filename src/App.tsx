import React, { useState } from 'react';
import {
  CalendarCheck,
  Code2,
  Award,
  GitBranch,
  Terminal,
  Activity,
  Layers,
  Database,
  ExternalLink,
} from 'lucide-react';
import { ChronoPlanSimulator } from './components/ChronoPlanSimulator';
import { CodeInspector } from './components/CodeInspector';
import { GradingRubric } from './components/GradingRubric';
import { NetworkInspector } from './components/NetworkInspector';
import { NetworkLog } from './types/planningTypes';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'rubric'>('simulator');
  const [showNetworkInspector, setShowNetworkInspector] = useState<boolean>(true);
  const [networkLogs, setNetworkLogs] = useState<NetworkLog[]>([
    {
      id: 'init-1',
      timestamp: '10:45:02',
      method: 'POST',
      endpoint: '/auth/login',
      status: 200,
      bearerInjected: false,
      cachedInHive: true,
      durationMs: 220,
    },
    {
      id: 'init-2',
      timestamp: '10:45:03',
      method: 'GET',
      endpoint: '/todos?limit=25',
      status: 200,
      bearerInjected: true,
      cachedInHive: true,
      durationMs: 180,
    },
    {
      id: 'init-3',
      timestamp: '10:45:04',
      method: 'GET',
      endpoint: '/auth/me',
      status: 200,
      bearerInjected: true,
      cachedInHive: true,
      durationMs: 140,
    },
  ]);

  const handleAddNetworkLog = (log: NetworkLog) => {
    setNetworkLogs((prev) => [log, ...prev.slice(0, 30)]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Top Header */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white">ChronoPlan</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                100/100 PTS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Flutter Connected App • REST API • JWT • Hive Cache • Clean Architecture
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Simulateur Flutter</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Code Dart (Clean Arch)</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'rubric'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Barème (100 pts)</span>
          </button>
        </div>

        {/* GitHub link */}
        <a
          href="https://github.com/BenDiya07/Flutter-Project-Multi-screen-app-with-navigation"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition"
        >
          <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
          <span>GitHub Repo</span>
          <ExternalLink className="w-3 h-3 text-zinc-500 ml-0.5" />
        </a>
      </header>

      {/* Main View Area */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'simulator' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
            {/* Left: Mobile Simulator */}
            <div className="flex-1 flex justify-center items-center py-6 px-4">
              <ChronoPlanSimulator onLogNetwork={handleAddNetworkLog} />
            </div>

            {/* Right: Technical Inspector (Dio Logs & Architecture Highlights) */}
            <div className="w-full lg:w-[440px] xl:w-[480px] border-t lg:border-t-0 lg:border-l border-zinc-800 p-4 sm:p-6 bg-zinc-950/60 flex flex-col gap-4">
              {/* Clean Architecture Quick Guide Card */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                  <Layers className="w-4 h-4" />
                  <span>Architecture Feature-First Validée</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  L'application découple strictement les couches <strong>Domain</strong> (entités pures),{' '}
                  <strong>Data</strong> (Dio REST API & cache Hive NoSQL) et <strong>Presentation</strong> (Riverpod).
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
                    <span className="text-zinc-500 block">Token JWT:</span>
                    <span className="font-semibold text-emerald-400">AuthInterceptor</span>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/80">
                    <span className="text-zinc-500 block">Base Locale:</span>
                    <span className="font-semibold text-indigo-400">Hive NoSQL</span>
                  </div>
                </div>
              </div>

              {/* Dio Network Inspector */}
              <div className="flex-1 min-h-[380px]">
                <NetworkInspector logs={networkLogs} onClear={() => setNetworkLogs([])} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="flex-1 overflow-hidden">
            <CodeInspector />
          </div>
        )}

        {activeTab === 'rubric' && (
          <div className="flex-1 overflow-y-auto">
            <GradingRubric />
          </div>
        )}
      </main>
    </div>
  );
}
