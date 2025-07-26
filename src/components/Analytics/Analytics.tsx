import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, Target, Award } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Assignment, PomodoroSession } from '../../types';

export const Analytics: React.FC = () => {
  const [assignments] = useLocalStorage<Assignment[]>('campus_assignments', []);
  const [pomodoroSessions] = useLocalStorage<PomodoroSession[]>('campus_pomodoro_sessions', []);

  // Calculate weekly data
  const getWeeklyData = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyAssignments = assignments.filter(a => 
      new Date(a.dueDate) >= oneWeekAgo && new Date(a.dueDate) <= now
    );
    
    const weeklySessions = pomodoroSessions.filter(s => 
      new Date(s.date) >= oneWeekAgo && new Date(s.date) <= now
    );

    return { weeklyAssignments, weeklySessions };
  };

  const { weeklyAssignments, weeklySessions } = getWeeklyData();

  // Calculate stats
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.completed).length;
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  const totalStudyTime = pomodoroSessions
    .filter(s => s.completed)
    .reduce((acc, session) => acc + session.duration, 0);

  const averageStudyTimePerDay = totalStudyTime > 0 ? totalStudyTime / 7 : 0;

  const overdueAssignments = assignments.filter(a => 
    !a.completed && new Date(a.dueDate) < new Date()
  ).length;

  // Weekly breakdown
  const weeklyStudyTime = weeklySessions
    .filter(s => s.completed)
    .reduce((acc, session) => acc + session.duration, 0);

  const weeklyCompletedAssignments = weeklyAssignments.filter(a => a.completed).length;

  // Subject breakdown
  const subjectStats = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.subject]) {
      acc[assignment.subject] = { total: 0, completed: 0 };
    }
    acc[assignment.subject].total++;
    if (assignment.completed) {
      acc[assignment.subject].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  const studySubjectStats = pomodoroSessions
    .filter(s => s.completed)
    .reduce((acc, session) => {
      if (!acc[session.subject]) {
        acc[session.subject] = 0;
      }
      acc[session.subject] += session.duration;
      return acc;
    }, {} as Record<string, number>);

  const stats = [
    {
      label: 'Total Study Time',
      value: `${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      change: `+${weeklyStudyTime}m this week`
    },
    {
      label: 'Assignment Completion',
      value: `${Math.round(completionRate)}%`,
      icon: CheckCircle,
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-500/20 to-teal-500/20',
      change: `${completedAssignments}/${totalAssignments} completed`
    },
    {
      label: 'Daily Average',
      value: `${Math.round(averageStudyTimePerDay)}m`,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/20 to-pink-500/20',
      change: 'Study time per day'
    },
    {
      label: 'Overdue Tasks',
      value: overdueAssignments,
      icon: Award,
      color: overdueAssignments > 0 ? 'from-red-500 to-orange-500' : 'from-green-500 to-teal-500',
      bgColor: overdueAssignments > 0 ? 'from-red-500/20 to-orange-500/20' : 'from-green-500/20 to-teal-500/20',
      change: overdueAssignments === 0 ? 'All caught up!' : 'Need attention'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Study Analytics</h1>
          <p className="text-gray-300">Track your productivity and study patterns</p>
        </div>
        <div className="text-4xl">📊</div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${stat.bgColor} backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-300 text-sm mb-2">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Performance */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
              Assignment Progress by Subject
            </h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries(subjectStats).length > 0 ? (
              Object.entries(subjectStats).map(([subject, stats]) => {
                const completionPercentage = (stats.completed / stats.total) * 100;
                
                return (
                  <div key={subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{subject}</span>
                      <span className="text-gray-300 text-sm">
                        {stats.completed}/{stats.total} ({Math.round(completionPercentage)}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No assignments data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Study Time by Subject */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-400" />
              Study Time by Subject
            </h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries(studySubjectStats).length > 0 ? (
              Object.entries(studySubjectStats)
                .sort(([,a], [,b]) => b - a)
                .map(([subject, minutes]) => {
                  const maxMinutes = Math.max(...Object.values(studySubjectStats));
                  const percentage = (minutes / maxMinutes) * 100;
                  
                  return (
                    <div key={subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{subject}</span>
                        <span className="text-gray-300 text-sm">
                          {Math.floor(minutes / 60)}h {minutes % 60}m
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No study sessions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
          This Week's Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {Math.floor(weeklyStudyTime / 60)}h {weeklyStudyTime % 60}m
            </div>
            <div className="text-gray-300 text-sm">Study Time</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {weeklyCompletedAssignments}
            </div>
            <div className="text-gray-300 text-sm">Assignments Done</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-xl">
            <div className="text-2xl mb-2">🍅</div>
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {weeklySessions.filter(s => s.completed).length}
            </div>
            <div className="text-gray-300 text-sm">Pomodoro Sessions</div>
          </div>
        </div>
      </div>

      {/* Productivity Tips */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          💡 Productivity Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="font-semibold text-yellow-300 mb-2">Study Pattern</h3>
            <p className="text-gray-300 text-sm">
              {averageStudyTimePerDay > 60 
                ? "Great job maintaining consistent study habits! Keep it up."
                : "Try to increase your daily study time for better results."
              }
            </p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4">
            <h3 className="font-semibold text-yellow-300 mb-2">Assignment Management</h3>
            <p className="text-gray-300 text-sm">
              {overdueAssignments === 0 
                ? "Excellent! You're staying on top of all your assignments."
                : `You have ${overdueAssignments} overdue assignment${overdueAssignments !== 1 ? 's' : ''}. Consider prioritizing them.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};