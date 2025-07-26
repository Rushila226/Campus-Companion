/*import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee, Clock } from 'lucide-react';
import { PomodoroSession } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const PomodoroTimer: React.FC = () => {
  const [sessions, setSessions] = useLocalStorage<PomodoroSession[]>('campus_pomodoro_sessions', []);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  const [currentSubject, setCurrentSubject] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useLocalStorage('pomodoro_settings', {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const completedSessions = sessions.filter(s => s.completed && s.date === new Date().toLocaleDateString()).length;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    
    if (sessionType === 'work') {
      // Save completed work session
      const session: PomodoroSession = {
        id: Date.now().toString(),
        duration: settings.workDuration,
        completed: true,
        date: new Date().toLocaleDateString(),
        subject: currentSubject || 'General Study',
      };
      setSessions([...sessions, session]);

      // Determine next break type
      const nextSessionsCompleted = completedSessions + 1;
      const isLongBreak = nextSessionsCompleted % settings.sessionsUntilLongBreak === 0;
      
      setSessionType('break');
      setTimeLeft((isLongBreak ? settings.longBreak : settings.shortBreak) * 60);
      
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
          body: `Time for a ${isLongBreak ? 'long' : 'short'} break!`,
          icon: '/favicon.ico'
        });
      }
    } else {
      // Break complete, start new work session
      setSessionType('work');
      setTimeLeft(settings.workDuration * 60);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Complete!', {
          body: 'Ready to focus again?',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const toggleTimer = () => {
    if (!isActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSessionType('work');
    setTimeLeft(settings.workDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = sessionType === 'work' 
    ? ((settings.workDuration * 60 - timeLeft) / (settings.workDuration * 60)) * 100
    : sessionType === 'break' && completedSessions % settings.sessionsUntilLongBreak === 0
    ? ((settings.longBreak * 60 - timeLeft) / (settings.longBreak * 60)) * 100
    : ((settings.shortBreak * 60 - timeLeft) / (settings.shortBreak * 60)) * 100;

  const todaysSessions = sessions.filter(s => s.date === new Date().toLocaleDateString());
  const todaysCompletedSessions = todaysSessions.filter(s => s.completed);
  const totalStudyTime = todaysCompletedSessions.reduce((acc, session) => acc + session.duration, 0);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Pomodoro Timer</h1>
        <p className="text-gray-300">Stay focused and productive with timed study sessions</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {sessionType === 'work' ? (
                <Clock className="w-6 h-6 text-purple-400" />
              ) : (
                <Coffee className="w-6 h-6 text-green-400" />
              )}
              <span className={`text-lg font-semibold ${
                sessionType === 'work' ? 'text-purple-400' : 'text-green-400'
              }`}>
                {sessionType === 'work' ? 'Focus Time' : 'Break Time'}
              </span>
            </div>
            

            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-white/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  className={sessionType === 'work' ? 'text-purple-400' : 'text-green-400'}
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {sessionType === 'work' && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="What are you studying?"
                value={currentSubject}
                onChange={(e) => setCurrentSubject(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
              />
            </div>
          )}

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={toggleTimer}
              className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                sessionType === 'work'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                  : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
              } text-white`}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isActive ? 'Pause' : 'Start'}</span>
            </button>
            
            <button
              onClick={resetTimer}
              className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">{completedSessions}</div>
          <div className="text-gray-300">Sessions Today</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</div>
          <div className="text-gray-300">Study Time Today</div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {Math.floor(completedSessions / settings.sessionsUntilLongBreak)}
          </div>
          <div className="text-gray-300">Cycles Completed</div>
        </div>
      </div>

  
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Today's Sessions</h2>
        
        {todaysCompletedSessions.length > 0 ? (
          <div className="space-y-3">
            {todaysCompletedSessions.slice(-5).reverse().map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-white font-medium">{session.subject}</span>
                </div>
                <span className="text-gray-300">{session.duration} minutes</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No sessions completed today</p>
          </div>
        )}
      </div>

      
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

interface SettingsModalProps {
  settings: any;
  onSave: (settings: any) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-6">Timer Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Work Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={formData.workDuration}
              onChange={(e) => setFormData({ ...formData, workDuration: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Short Break (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={formData.shortBreak}
              onChange={(e) => setFormData({ ...formData, shortBreak: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Long Break (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={formData.longBreak}
              onChange={(e) => setFormData({ ...formData, longBreak: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sessions until Long Break
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={formData.sessionsUntilLongBreak}
              onChange={(e) => setFormData({ ...formData, sessionsUntilLongBreak: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
*/
/*import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee, Clock } from 'lucide-react';
import { PomodoroSession } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const PomodoroTimer: React.FC = () => {
  const [sessions, setSessions] = useLocalStorage<PomodoroSession[]>('campus_pomodoro_sessions', []);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  const [currentSubject, setCurrentSubject] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useLocalStorage('pomodoro_settings', {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const completedSessions = sessions.filter(s => s.completed && s.date === new Date().toLocaleDateString()).length;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);

    if (sessionType === 'work') {
      const session: PomodoroSession = {
        id: Date.now().toString(),
        duration: settings.workDuration,
        completed: true,
        date: new Date().toLocaleDateString(),
        subject: currentSubject || 'General Study',
      };
      setSessions([...sessions, session]);

      const nextSessionsCompleted = completedSessions + 1;
      const isLongBreak = nextSessionsCompleted % settings.sessionsUntilLongBreak === 0;

      setSessionType('break');
      setTimeLeft((isLongBreak ? settings.longBreak : settings.shortBreak) * 60);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
          body: `Time for a ${isLongBreak ? 'long' : 'short'} break!`,
          icon: '/favicon.ico'
        });
      }
    } else {
      setSessionType('work');
      setTimeLeft(settings.workDuration * 60);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Complete!', {
          body: 'Ready to focus again?',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const toggleTimer = () => {
    if (!isActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSessionType('work');
    setTimeLeft(settings.workDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = sessionType === 'work'
    ? ((settings.workDuration * 60 - timeLeft) / (settings.workDuration * 60)) * 100
    : sessionType === 'break' && completedSessions % settings.sessionsUntilLongBreak === 0
    ? ((settings.longBreak * 60 - timeLeft) / (settings.longBreak * 60)) * 100
    : ((settings.shortBreak * 60 - timeLeft) / (settings.shortBreak * 60)) * 100;

  const todaysSessions = sessions.filter(s => s.date === new Date().toLocaleDateString());
  const todaysCompletedSessions = todaysSessions.filter(s => s.completed);
  const totalStudyTime = todaysCompletedSessions.reduce((acc, session) => acc + session.duration, 0);

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-6 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pomodoro Timer</h1>
        <p className="text-gray-200">Stay focused and productive with timed study sessions</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-8 border border-white/30 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {sessionType === 'work' ? (
                <Clock className="w-6 h-6 text-purple-300" />
              ) : (
                <Coffee className="w-6 h-6 text-green-300" />
              )}
              <span className={`text-lg font-semibold ${sessionType === 'work' ? 'text-purple-300' : 'text-green-300'}`}>
                {sessionType === 'work' ? 'Focus Time' : 'Break Time'}
              </span>
            </div>

            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" className="text-white/20" />
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" className={sessionType === 'work' ? 'text-purple-400' : 'text-green-400'} strokeDasharray={`${2 * Math.PI * 45}`} strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`} style={{ transition: 'stroke-dashoffset 1s ease' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {sessionType === 'work' && (
            <div className="mb-4">
              <input type="text" placeholder="What are you studying?" value={currentSubject} onChange={(e) => setCurrentSubject(e.target.value)} className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center" />
            </div>
          )}

          <div className="flex items-center justify-center space-x-4">
            <button onClick={toggleTimer} className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${sessionType === 'work' ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'} text-white`}>
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isActive ? 'Pause' : 'Start'}</span>
            </button>
            <button onClick={resetTimer} className="p-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 text-center">
          <div className="text-3xl font-bold text-purple-300 mb-2">{completedSessions}</div>
          <div className="text-gray-200">Sessions Today</div>
        </div>
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 text-center">
          <div className="text-3xl font-bold text-green-300 mb-2">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</div>
          <div className="text-gray-200">Study Time Today</div>
        </div>
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 text-center">
          <div className="text-3xl font-bold text-blue-300 mb-2">{Math.floor(completedSessions / settings.sessionsUntilLongBreak)}</div>
          <div className="text-gray-200">Cycles Completed</div>
        </div>
      </div>

      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
        <h2 className="text-xl font-bold mb-4">Today's Sessions</h2>
        {todaysCompletedSessions.length > 0 ? (
          <div className="space-y-3">
            {todaysCompletedSessions.slice(-5).reverse().map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="font-medium">{session.subject}</span>
                </div>
                <span className="text-gray-200">{session.duration} minutes</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No sessions completed today</p>
          </div>
        )}
      </div>

      {showSettings && (
        <SettingsModal settings={settings} onSave={setSettings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};
*/
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee, Clock } from 'lucide-react';
import { PomodoroSession } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const PomodoroTimer: React.FC = () => {
  const [sessions, setSessions] = useLocalStorage<PomodoroSession[]>('campus_pomodoro_sessions', []);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  const [currentSubject, setCurrentSubject] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useLocalStorage('pomodoro_settings', {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const completedSessions = sessions.filter(s => s.completed && s.date === new Date().toLocaleDateString()).length;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);

    if (sessionType === 'work') {
      const session: PomodoroSession = {
        id: Date.now().toString(),
        duration: settings.workDuration,
        completed: true,
        date: new Date().toLocaleDateString(),
        subject: currentSubject || 'General Study',
      };
      setSessions([...sessions, session]);

      const nextSessionsCompleted = completedSessions + 1;
      const isLongBreak = nextSessionsCompleted % settings.sessionsUntilLongBreak === 0;

      setSessionType('break');
      setTimeLeft((isLongBreak ? settings.longBreak : settings.shortBreak) * 60);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
          body: `Time for a ${isLongBreak ? 'long' : 'short'} break!`,
          icon: '/favicon.ico'
        });
      }
    } else {
      setSessionType('work');
      setTimeLeft(settings.workDuration * 60);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Complete!', {
          body: 'Ready to focus again?',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const toggleTimer = () => {
    if (!isActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSessionType('work');
    setTimeLeft(settings.workDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = sessionType === 'work'
    ? ((settings.workDuration * 60 - timeLeft) / (settings.workDuration * 60)) * 100
    : sessionType === 'break' && completedSessions % settings.sessionsUntilLongBreak === 0
    ? ((settings.longBreak * 60 - timeLeft) / (settings.longBreak * 60)) * 100
    : ((settings.shortBreak * 60 - timeLeft) / (settings.shortBreak * 60)) * 100;

  const todaysSessions = sessions.filter(s => s.date === new Date().toLocaleDateString());
  const todaysCompletedSessions = todaysSessions.filter(s => s.completed);
  const totalStudyTime = todaysCompletedSessions.reduce((acc, session) => acc + session.duration, 0);

  return (
    <div className="space-y-8 bg-gradient-to-br from-white to-gray-100 min-h-screen p-6 text-gray-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pomodoro Timer</h1>
        <p className="text-gray-600">Stay focused and productive with timed study sessions</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-gray-300 shadow-md text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {sessionType === 'work' ? (
                <Clock className="w-6 h-6 text-purple-500" />
              ) : (
                <Coffee className="w-6 h-6 text-green-500" />
              )}
              <span className={`text-lg font-semibold ${sessionType === 'work' ? 'text-purple-600' : 'text-green-600'}`}>
                {sessionType === 'work' ? 'Focus Time' : 'Break Time'}
              </span>
            </div>

            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-300" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  className={sessionType === 'work' ? 'text-purple-500' : 'text-green-500'}
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-800">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {sessionType === 'work' && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="What are you studying?"
                value={currentSubject}
                onChange={(e) => setCurrentSubject(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 text-center"
              />
            </div>
          )}

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={toggleTimer}
              className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                sessionType === 'work'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                  : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
              } text-white`}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isActive ? 'Pause' : 'Start'}</span>
            </button>
            <button onClick={resetTimer} className="p-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-300 text-center shadow-sm">
          <div className="text-3xl font-bold text-purple-600 mb-2">{completedSessions}</div>
          <div className="text-gray-600">Sessions Today</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-300 text-center shadow-sm">
          <div className="text-3xl font-bold text-green-600 mb-2">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</div>
          <div className="text-gray-600">Study Time Today</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-300 text-center shadow-sm">
          <div className="text-3xl font-bold text-blue-600 mb-2">{Math.floor(completedSessions / settings.sessionsUntilLongBreak)}</div>
          <div className="text-gray-600">Cycles Completed</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Today's Sessions</h2>
        {todaysCompletedSessions.length > 0 ? (
          <div className="space-y-3">
            {todaysCompletedSessions.slice(-5).reverse().map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium text-gray-800">{session.subject}</span>
                </div>
                <span className="text-gray-600">{session.duration} minutes</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No sessions completed today</p>
          </div>
        )}
      </div>

      {showSettings && (
        <SettingsModal settings={settings} onSave={setSettings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

