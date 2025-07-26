/*import React from 'react';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Clock, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'timetable', label: 'Timetable', icon: Calendar },
  { id: 'assignments', label: 'Assignments', icon: BookOpen },
  { id: 'notes', label: 'Notes', icon: BookOpen },
  { id: 'pomodoro', label: 'Pomodoro', icon: Clock },
  { id: 'clubs', label: 'Clubs', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  onLogout,
  darkMode,
  onToggleDarkMode,
  collapsed,
}) => {
  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white/10 backdrop-blur-xl border-r border-white/10 flex flex-col`}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">Campus</h1>
              <p className="text-sm text-gray-300">Companion</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'group-hover:text-purple-400'}`} />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 space-y-2">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!collapsed && (
            <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </button>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && (
            <span className="font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};
*/
import React from 'react';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Clock, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'timetable', label: 'Timetable', icon: Calendar },
  { id: 'assignments', label: 'Assignments', icon: BookOpen },
  { id: 'notes', label: 'Notes', icon: BookOpen },
  { id: 'pomodoro', label: 'Pomodoro', icon: Clock },
  { id: 'clubs', label: 'Clubs', icon: Users },
 // { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  //{ id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  onLogout,
  darkMode,
  onToggleDarkMode,
  collapsed,
}) => {
  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-gradient-to-b from-white via-sky-100 to-blue-100 border-r border-blue-200 flex flex-col`}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-800">Campus</h1>
              <p className="text-sm text-gray-500">Companion</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-800 font-semibold shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'group-hover:text-blue-600'}`} />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 space-y-2">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition-all"
        >
          
        </button>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-100 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && (
            <span className="font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};
