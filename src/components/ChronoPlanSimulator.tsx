import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  RefreshCw,
  Wifi,
  WifiOff,
  Flame,
  Clock,
  Play,
  Pause,
  RotateCcw,
  User,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Search,
  Database,
  Terminal,
  Activity,
} from 'lucide-react';
import { Task, AuthUser, Priority, NetworkLog, ActiveScreen } from '../types/planningTypes';
import { INITIAL_TASKS, INITIAL_USER } from '../data/initialTasks';

interface ChronoPlanSimulatorProps {
  onLogNetwork: (log: NetworkLog) => void;
}

export const ChronoPlanSimulator: React.FC<ChronoPlanSimulatorProps> = ({ onLogNetwork }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('tasks');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(INITIAL_TASKS[0]);
  const [user, setUser] = useState<AuthUser | null>(INITIAL_USER);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('p2');
  const [newTaskProject, setNewTaskProject] = useState('Travail');
  const [newTaskMinutes, setNewTaskMinutes] = useState(25);

  // Pomodoro Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsPomodoroRunning(false);
    }
    return () => clearInterval(interval);
  }, [isPomodoroRunning, pomodoroSeconds]);

  const projects = ['Tous', 'Travail', 'Personnel', 'Études', 'Santé', 'Finance'];

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'p1':
        return { label: 'P1 Urgent', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
      case 'p2':
        return { label: 'P2 Élevée', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
      case 'p3':
        return { label: 'P3 Moyenne', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
      case 'p4':
        return { label: 'P4 Basse', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' };
    }
  };

  const handleToggleTask = (id: number, currentCompleted: boolean) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !currentCompleted } : t))
    );

    // Network log
    onLogNetwork({
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      method: 'PUT',
      endpoint: `/todos/${id}`,
      status: isOnline ? 200 : 304,
      bearerInjected: !!user?.isLoggedIn,
      cachedInHive: true,
      durationMs: isOnline ? 120 : 8,
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onLogNetwork({
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
        method: 'GET',
        endpoint: '/todos?limit=25',
        status: isOnline ? 200 : 304,
        bearerInjected: !!user?.isLoggedIn,
        cachedInHive: true,
        durationMs: isOnline ? 210 : 12,
      });
    }, 600);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now() % 100000,
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      project: newTaskProject,
      estimatedMinutes: newTaskMinutes,
      dueDate: "Aujourd'hui",
      isSyncPending: !isOnline,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowAddModal(false);

    onLogNetwork({
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      method: 'POST',
      endpoint: '/todos/add',
      status: isOnline ? 201 : 200,
      bearerInjected: !!user?.isLoggedIn,
      cachedInHive: true,
      durationMs: isOnline ? 180 : 10,
    });
  };

  const handleLogin = () => {
    setUser(INITIAL_USER);
    setActiveScreen('tasks');
    onLogNetwork({
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      method: 'POST',
      endpoint: '/auth/login',
      status: 200,
      bearerInjected: false,
      cachedInHive: true,
      durationMs: 240,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setActiveScreen('login');
    onLogNetwork({
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      method: 'GET',
      endpoint: '/auth/logout (Hive cleared)',
      status: 200,
      bearerInjected: false,
      cachedInHive: true,
      durationMs: 15,
    });
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesProject = selectedProject === 'Tous' || t.project === selectedProject;
    const matchesSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const completionRate = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-6 w-full">
      {/* Simulation Quick Control Bar */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between px-2 py-1.5 bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-medium">Connectivité :</span>
          <button
            onClick={() => {
              const next = !isOnline;
              setIsOnline(next);
              onLogNetwork({
                id: Math.random().toString(36).substring(7),
                timestamp: new Date().toLocaleTimeString(),
                method: 'GET',
                endpoint: next ? 'Connectivity: ONLINE' : 'Connectivity: OFFLINE (Hive fallback)',
                status: next ? 200 : 503,
                bearerInjected: false,
                cachedInHive: true,
                durationMs: 5,
              });
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isOnline ? 'En ligne (API REST)' : 'Hors-ligne (Hive Cache)'}
          </button>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 transition"
          title="Simuler GET /todos"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Sync</span>
        </button>
      </div>

      {/* Phone Mockup Frame */}
      <div className="relative w-full max-w-[380px] h-[720px] bg-zinc-950 border-4 border-zinc-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col">
        {/* Notch / Speaker */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center items-center z-50 pointer-events-none">
          <div className="w-28 h-4 bg-zinc-900 rounded-b-xl flex items-center justify-center">
            <div className="w-8 h-1 bg-zinc-700 rounded-full"></div>
          </div>
        </div>

        {/* Offline Banner Bar */}
        {!isOnline && (
          <div className="bg-amber-600 text-white text-[11px] font-medium py-1 px-3 text-center flex items-center justify-center gap-1.5 shadow z-40 animate-pulse">
            <Database className="w-3 h-3" />
            <span>Mode Hors-ligne : Données servies depuis Hive (10:45)</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 flex flex-col pt-4">
          {/* SCREEN 1: TASKS & PLANNING */}
          {activeScreen === 'tasks' && (
            <div className="flex-1 flex flex-col px-4 pb-20">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pt-2">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>Aujourd'hui</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {tasks.length} tâches
                    </span>
                  </h1>
                  <p className="text-xs text-zinc-400">Synchronisé avec DummyJSON /todos</p>
                </div>
                {user && (
                  <button
                    onClick={() => setActiveScreen('stats')}
                    className="w-9 h-9 rounded-full overflow-hidden border border-indigo-500/40 hover:border-indigo-400 transition"
                  >
                    <img src={user.image} alt={user.fullName} className="w-full h-full object-cover" />
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Rechercher une tâche..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Project Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
                {projects.map((proj) => (
                  <button
                    key={proj}
                    onClick={() => setSelectedProject(proj)}
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium transition ${
                      selectedProject === proj
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {proj}
                  </button>
                ))}
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-2">
                {filteredTasks.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 text-xs">
                    Aucune tâche trouvée pour ce filtre.
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const priorityBadge = getPriorityBadge(task.priority);
                    return (
                      <div
                        key={task.id}
                        className="group bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-3 transition flex items-start gap-3 cursor-pointer"
                        onClick={() => {
                          setSelectedTask(task);
                          setActiveScreen('detail');
                        }}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTask(task.id, task.completed);
                          }}
                          className="mt-0.5 text-zinc-500 hover:text-emerald-400 transition"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-600 hover:text-zinc-400" />
                          )}
                        </button>

                        {/* Title & Details */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-semibold leading-snug truncate ${
                              task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${priorityBadge.color}`}
                            >
                              {priorityBadge.label}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">#{task.project}</span>
                            <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {task.estimatedMinutes}m
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 self-center" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* SCREEN 2: TASK DETAIL & POMODORO TIMER */}
          {activeScreen === 'detail' && selectedTask && (
            <div className="flex-1 flex flex-col px-4 pb-20">
              <button
                onClick={() => setActiveScreen('tasks')}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white mb-3 pt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour au planning</span>
              </button>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 font-medium">
                  #{selectedTask.project}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    selectedTask.completed
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {selectedTask.completed ? 'Terminée' : 'À faire'}
                </span>
              </div>

              <h2 className="text-base font-bold text-white mb-2">{selectedTask.title}</h2>
              <p className="text-xs text-zinc-400 mb-4">{selectedTask.notes}</p>

              {/* Pomodoro Focus Timer Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center mb-4 shadow-md">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-orange-400 mb-2">
                  <Flame className="w-4 h-4" />
                  <span>Session Pomodoro Focus (25m)</span>
                </div>
                <div className="text-4xl font-mono font-black text-white tracking-widest my-2">
                  {String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0')}:
                  {String(pomodoroSeconds % 60).padStart(2, '0')}
                </div>
                <div className="flex justify-center gap-2 mt-3">
                  <button
                    onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white transition ${
                      isPomodoroRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
                    }`}
                  >
                    {isPomodoroRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPomodoroRunning ? 'Pause' : 'Démarrer'}
                  </button>
                  <button
                    onClick={() => {
                      setIsPomodoroRunning(false);
                      setPomodoroSeconds(25 * 60);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Subtasks */}
              <div className="space-y-2 mb-4">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Sous-tâches</h3>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 space-y-2 text-xs">
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-500" />
                    <span>Spécifier l'intercepteur Dio QueuedInterceptor</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-500" />
                    <span>Générer les boîtes Hive (tasks_box & auth_box)</span>
                  </label>
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input type="checkbox" className="rounded text-indigo-500" />
                    <span>Exécuter les 5 tests unitaires Mocktail</span>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  handleToggleTask(selectedTask.id, selectedTask.completed);
                  setActiveScreen('tasks');
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition ${
                  selectedTask.completed ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {selectedTask.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
              </button>
            </div>
          )}

          {/* SCREEN 3: PROFILE & PRODUCTIVITY STATS */}
          {activeScreen === 'stats' && user && (
            <div className="flex-1 flex flex-col px-4 pb-20">
              <div className="flex items-center justify-between mb-3 pt-2">
                <h1 className="text-xl font-bold text-white">Profil & Métriques</h1>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-red-400 hover:bg-zinc-800"
                  title="Déconnexion (purge Hive)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Identity Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center mb-3">
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-indigo-500 mb-2">
                  <img src={user.image} alt={user.fullName} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-sm font-bold text-white">{user.fullName}</h2>
                <p className="text-xs text-zinc-400">@{user.username} • {user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>JWT Authentifié (GET /auth/me)</span>
                </div>
              </div>

              {/* Completion Stats */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 mb-3">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-2">
                  <span>Taux de réalisation</span>
                  <span className="text-indigo-400">{completionRate}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-zinc-950 p-2 rounded-xl">
                    <p className="text-base font-bold text-white">{completedCount}</p>
                    <p className="text-[10px] text-zinc-500">Terminées</p>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded-xl">
                    <p className="text-base font-bold text-white">{tasks.length}</p>
                    <p className="text-[10px] text-zinc-500">Total</p>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded-xl">
                    <p className="text-base font-bold text-amber-400">5j 🔥</p>
                    <p className="text-[10px] text-zinc-500">Série active</p>
                  </div>
                </div>
              </div>

              {/* Technical JWT Details */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-xs space-y-2">
                <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Détails Techniques Session</span>
                </div>
                <div className="font-mono text-[10px] bg-zinc-950 p-2 rounded-lg text-zinc-400 break-all">
                  <span className="text-zinc-500">Bearer: </span>
                  {user.accessToken.substring(0, 32)}...
                </div>
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>Stockage Token:</span>
                  <span className="text-indigo-400 font-semibold">Hive auth_box</span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>Auto-Refresh 401:</span>
                  <span className="text-emerald-400 font-semibold">QueuedInterceptor Actif</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 4: LOGIN */}
          {activeScreen === 'login' && (
            <div className="flex-1 flex flex-col justify-center px-6 pb-12">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg shadow-indigo-500/20">
                  CP
                </div>
                <h2 className="text-lg font-bold text-white">Connexion ChronoPlan</h2>
                <p className="text-xs text-zinc-400">REST API JWT DummyJSON (/auth/login)</p>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[11px] text-zinc-400 font-medium block mb-1">Identifiant</label>
                  <input
                    type="text"
                    defaultValue="emilys"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 font-medium block mb-1">Mot de passe</label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg transition mb-3"
              >
                Se connecter (Obtenir le token JWT)
              </button>

              <button
                onClick={() => {
                  setUser(INITIAL_USER);
                  setActiveScreen('tasks');
                }}
                className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-400 font-medium"
              >
                Continuer en tant qu'invité
              </button>
            </div>
          )}
        </div>

        {/* Floating Add Task Button (when on tasks screen) */}
        {activeScreen === 'tasks' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="absolute bottom-20 right-5 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl flex items-center justify-center transition active:scale-95"
            title="Ajouter une tâche"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-zinc-950/95 backdrop-blur border-t border-zinc-800/80 flex items-center justify-around px-6 z-40">
          <button
            onClick={() => setActiveScreen('tasks')}
            className={`flex flex-col items-center gap-1 transition ${
              activeScreen === 'tasks' || activeScreen === 'detail' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Aujourd'hui</span>
          </button>

          <button
            onClick={() => setActiveScreen(user ? 'stats' : 'login')}
            className={`flex flex-col items-center gap-1 transition ${
              activeScreen === 'stats' || activeScreen === 'login' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Profil & Stats</span>
          </button>
        </div>

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center">
            <form
              onSubmit={handleCreateTask}
              className="w-full bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-5 animate-in slide-in-from-bottom"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Nouvelle Tâche (POST /todos/add)</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-zinc-400 hover:text-white text-xs"
                >
                  Fermer
                </button>
              </div>

              <input
                type="text"
                autoFocus
                placeholder="Ex: Réviser le pattern Repository..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white mb-3 focus:outline-none focus:border-indigo-500"
              />

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1 font-medium">Priorité</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-300"
                  >
                    <option value="p1">P1 Urgent (Rouge)</option>
                    <option value="p2">P2 Élevée (Orange)</option>
                    <option value="p3">P3 Moyenne (Bleu)</option>
                    <option value="p4">P4 Basse (Gris)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1 font-medium">Projet</label>
                  <select
                    value={newTaskProject}
                    onChange={(e) => setNewTaskProject(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-300"
                  >
                    <option value="Travail">Travail</option>
                    <option value="Personnel">Personnel</option>
                    <option value="Études">Études</option>
                    <option value="Santé">Santé</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg transition"
              >
                Enregistrer la tâche dans le planning
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
