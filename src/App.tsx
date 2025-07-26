/*import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Sidebar } from './components/Dashboard/Sidebar';
import { DashboardHome } from './components/Dashboard/DashboardHome';
import { Timetable } from './components/Timetable/Timetable';
import { Assignments } from './components/Assignments/Assignments';
import { Notes } from './components/Notes/Notes';
import { PomodoroTimer } from './components/Pomodoro/PomodoroTimer';
import { ClubHub } from './components/Clubs/ClubHub';
import { Analytics } from './components/Analytics/Analytics';
import { Assignment, Class, PomodoroSession } from './types';

function App() {
  const { user, login, register, logout, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useLocalStorage('campus_dark_mode', true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data hooks for dashboard
  const [assignments] = useLocalStorage<Assignment[]>('campus_assignments', []);
  const [classes] = useLocalStorage<Class[]>('campus_classes', []);
  const [pomodoroSessions] = useLocalStorage<PomodoroSession[]>('campus_pomodoro_sessions', []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex items-center justify-center">
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Campus Companion
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-md">
                Your all-in-one productivity hub for college life. Manage classes, assignments, notes, and more.
              </p>
              <div className="text-8xl mb-6">🎓</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="font-semibold">Smart Timetable</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-semibold">Assignment Tracker</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-2xl mb-2">🍅</div>
                  <div className="font-semibold">Pomodoro Timer</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold">Analytics</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-md">
            {isLogin ? (
              <LoginForm
                onLogin={login}
                onSwitchToRegister={() => setIsLogin(false)}
              />
            ) : (
              <RegisterForm
                onRegister={register}
                onSwitchToLogin={() => setIsLogin(true)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardHome
            assignments={assignments}
            classes={classes}
            pomodoroSessions={pomodoroSessions}
            user={user}
          />
        );
      case 'timetable':
        return <Timetable />;
      case 'assignments':
        return <Assignments />;
      case 'notes':
        return <Notes />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'clubs':
        return <ClubHub />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <DashboardHome
            assignments={assignments}
            classes={classes}
            pomodoroSessions={pomodoroSessions}
            user={user}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={logout}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-8">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
*/
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Sidebar } from './components/Dashboard/Sidebar';
import { DashboardHome } from './components/Dashboard/DashboardHome';
import { Timetable } from './components/Timetable/Timetable';
import { Assignments } from './components/Assignments/Assignments';
import { Notes } from './components/Notes/Notes';
import { PomodoroTimer } from './components/Pomodoro/PomodoroTimer';
import { ClubHub } from './components/Clubs/ClubHub';
import { Analytics } from './components/Analytics/Analytics';
import { Assignment, Class, PomodoroSession } from './types';

function App() {
  const { user, login, register, logout, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useLocalStorage('campus_dark_mode', true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data hooks for dashboard
  const [assignments] = useLocalStorage<Assignment[]>('campus_assignments', []);
  const [classes] = useLocalStorage<Class[]>('campus_classes', []);
  const [pomodoroSessions] = useLocalStorage<PomodoroSession[]>('campus_pomodoro_sessions', []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex items-center justify-center">
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Campus Companion
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-md">
                Your all-in-one productivity hub for college life. Manage classes, assignments, notes, and more.
              </p>
              <div className="text-8xl mb-6">🎓</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="font-semibold">Smart Timetable</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-semibold">Assignment Tracker</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-2xl mb-2">🍅</div>
                  <div className="font-semibold">Pomodoro Timer</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold">Analytics</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            {isLogin ? (
              <LoginForm
                onLogin={login}
                onSwitchToRegister={() => setIsLogin(false)}
              />
            ) : (
              <RegisterForm
                onRegister={register}
                onSwitchToLogin={() => setIsLogin(true)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardHome
            assignments={assignments}
            classes={classes}
            pomodoroSessions={pomodoroSessions}
            user={user}
          />
        );
      case 'timetable':
        return <Timetable />;
      case 'assignments':
        return <Assignments />;
      case 'notes':
        return <Notes />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'clubs':
        return <ClubHub />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <DashboardHome
            assignments={assignments}
            classes={classes}
            pomodoroSessions={pomodoroSessions}
            user={user}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e0f7fa] flex">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onLogout={logout}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-8">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
