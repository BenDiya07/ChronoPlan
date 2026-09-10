import React from 'react';
import { Terminal, Shield, Database, CheckCircle, Clock } from 'lucide-react';
import { NetworkLog } from '../types/planningTypes';

interface NetworkInspectorProps {
  logs: NetworkLog[];
  onClear: () => void;
}

export const NetworkInspector: React.FC<NetworkInspectorProps> = ({ logs, onClear }) => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">Dio Network Inspector & Hive Cache</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
            {logs.length} requêtes
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition"
        >
          Effacer
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pt-3 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-zinc-600">
            Effectuez des actions dans l'application pour inspecter les appels Dio REST API.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.method === 'GET'
                        ? 'bg-blue-500/20 text-blue-400'
                        : log.method === 'POST'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : log.method === 'PUT'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {log.method}
                  </span>
                  <span className="text-zinc-200 font-medium truncate max-w-[200px] sm:max-w-[280px]">
                    {log.endpoint}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    log.status >= 200 && log.status < 300
                      ? 'text-emerald-400'
                      : log.status === 304
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {log.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {log.timestamp} ({log.durationMs}ms)
                </span>
                {log.bearerInjected && (
                  <span className="flex items-center gap-0.5 text-indigo-400 font-semibold">
                    <Shield className="w-3 h-3" />
                    Bearer JWT
                  </span>
                )}
                {log.cachedInHive && (
                  <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                    <Database className="w-3 h-3" />
                    Hive Sync
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
