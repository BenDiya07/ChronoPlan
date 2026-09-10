import React, { useState } from 'react';
import { 
  FileCode2, 
  FolderTree, 
  Copy, 
  Check, 
  ExternalLink, 
  GitBranch, 
  Search, 
  Code,
  Layers,
  Sparkles
} from 'lucide-react';
import { FLUTTER_RIVERPOD_FILES, DartFile } from '../data/flutterRiverpodRepository';

export const CodeInspector: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('lib/main.dart');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const currentFile: DartFile = 
    FLUTTER_RIVERPOD_FILES.find((f) => f.path === selectedFilePath) || FLUTTER_RIVERPOD_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    { label: 'Tous les fichiers', value: 'all' },
    { label: 'Tâches & Planning', value: 'tasks' },
    { label: 'Core (API, Hive, Network)', value: 'core' },
    { label: 'Tests Unitaires (Mocktail)', value: 'tests' },
  ];

  const filteredFiles = FLUTTER_RIVERPOD_FILES.filter((f) => {
    if (activeCategory !== 'all' && f.category !== activeCategory) return false;
    if (searchFilter) {
      return (
        f.path.toLowerCase().includes(searchFilter.toLowerCase()) ||
        f.description.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0B0C10] text-gray-200">
      {/* Sidebar: File Explorer */}
      <div className="w-full md:w-80 flex-shrink-0 border-r border-[#2E3346] bg-[#12141C] flex flex-col">
        {/* Explorer Header */}
        <div className="p-3.5 border-b border-[#2E3346] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderTree size={16} className="text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-wider text-white">Explorateur Flutter</span>
            </div>
            <span className="rounded bg-indigo-500/20 text-indigo-300 px-2 py-0.5 text-[10px] font-mono font-bold">
              {FLUTTER_RIVERPOD_FILES.length} fichiers
            </span>
          </div>

          {/* Quick Filter */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrer un fichier..."
              className="w-full rounded-lg bg-[#181A24] border border-[#2E3346] pl-8 pr-2.5 py-1.5 text-xs text-gray-300 placeholder-gray-500 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={`rounded-md px-2 py-0.5 whitespace-nowrap transition ${
                  activeCategory === c.value
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-[#181A24] text-gray-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Files List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredFiles.map((file) => {
            const isSelected = selectedFilePath === file.path;
            const isYaml = file.name.endsWith('.yaml');
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFilePath(file.path)}
                className={`w-full text-left p-2 rounded-lg text-xs font-mono transition flex items-start gap-2 ${
                  isSelected
                    ? 'bg-indigo-600/20 border border-indigo-500/40 text-white font-bold'
                    : 'hover:bg-[#181A24] text-gray-400'
                }`}
              >
                <div className="pt-0.5 flex-shrink-0">
                  {isYaml ? (
                    <Code size={15} className="text-amber-400" />
                  ) : (
                    <FileCode2 size={15} className={isSelected ? 'text-indigo-400' : 'text-blue-400'} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px]">{file.path}</div>
                  <div className="text-[10px] text-gray-500 truncate">{file.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* GitHub Push Helper Info */}
        <div className="p-3 border-t border-[#2E3346] bg-[#0E1017] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-300 font-bold">
            <GitBranch size={14} className="text-emerald-400" />
            <span>Dépôt GitHub Synchronisé</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-tight">
            Code Flutter Riverpod prêt pour <code className="text-indigo-300">Flutter-Project-Multi-screen-app-with-navigation</code>.
          </p>
        </div>
      </div>

      {/* Editor Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0B0C10]">
        {/* Code Header Bar */}
        <div className="p-3 border-b border-[#2E3346] bg-[#12141C] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1 rounded bg-indigo-500/20 text-indigo-400">
              <FileCode2 size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-mono font-bold text-white truncate">{currentFile.path}</h3>
              <p className="text-[10px] text-gray-400 truncate">{currentFile.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-[#181A24] border border-[#2E3346] px-3 py-1.5 text-xs font-semibold text-gray-200 hover:text-white hover:border-indigo-500 transition"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copié !' : 'Copier le code'}</span>
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 overflow-auto p-4 bg-[#090A0E]">
          <pre className="font-mono text-xs text-gray-300 leading-relaxed tab-4">
            <code>{currentFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
