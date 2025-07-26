/*import React from 'react';
import { 
  Calendar, 
  BookOpen, 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { Assignment, Class, PomodoroSession } from '../../types';

interface DashboardHomeProps {
  assignments: Assignment[];
  classes: Class[];
  pomodoroSessions: PomodoroSession[];
  user: any;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  assignments,
  classes,
  pomodoroSessions,
  user
}) => {
  const today = new Date().toLocaleDateString();
  const todayClasses = classes.filter(c => c.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const upcomingAssignments = assignments
    .filter(a => !a.completed && new Date(a.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);
  const completedToday = pomodoroSessions.filter(s => 
    s.date === today && s.completed
  ).length;

  const stats = [
    {
      label: 'Today\'s Classes',
      value: todayClasses.length,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      label: 'Pending Tasks',
      value: upcomingAssignments.length,
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/20 to-pink-500/20'
    },
    {
      label: 'Focus Sessions',
      value: completedToday,
      icon: Clock,
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-500/20 to-teal-500/20'
    },
    {
      label: 'Study Streak',
      value: '7 days',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-500/20 to-red-500/20'
    }
  ];

  return (
        <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-300 text-lg">
              Ready to make today productive? You've got {todayClasses.length} classes and {upcomingAssignments.length} pending assignments.
            </p>
          </div>
          <div className="text-6xl">🎓</div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${stat.bgColor} backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              Today's Classes
            </h2>
          </div>
          
          <div className="space-y-3">
            {todayClasses.length > 0 ? (
              todayClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: classItem.color }}
                    ></div>
                    <div>
                      <p className="font-semibold text-white">{classItem.subject}</p>
                      <p className="text-gray-300 text-sm">{classItem.instructor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {classItem.startTime} - {classItem.endTime}
                    </p>
                    <p className="text-gray-300 text-sm">{classItem.room}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No classes scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-purple-400" />
              Upcoming Assignments
            </h2>
          </div>
          
          <div className="space-y-3">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment) => {
                const daysUntilDue = Math.ceil(
                  (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                const priorityColors = {
                  high: 'text-red-400 bg-red-500/20',
                  medium: 'text-yellow-400 bg-yellow-500/20',
                  low: 'text-green-400 bg-green-500/20'
                };

                return (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${priorityColors[assignment.priority]}`}>
                        {assignment.priority.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{assignment.title}</p>
                        <p className="text-gray-300 text-sm">{assignment.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {daysUntilDue === 0 ? 'Due Today' : `${daysUntilDue} days`}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">All caught up! No pending assignments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-400" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Assignment', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
            { label: 'Start Pomodoro', icon: Clock, color: 'from-green-500 to-teal-500' },
            { label: 'View Timetable', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
            { label: 'Join Club', icon: Users, color: 'from-orange-500 to-red-500' }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className={`p-4 bg-gradient-to-r ${action.color} rounded-xl text-white font-semibold hover:scale-105 transition-all flex flex-col items-center space-y-2`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
*/
import React from 'react';
import { 
  Calendar, 
  BookOpen, 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Star
} from 'lucide-react';
import { Assignment, Class, PomodoroSession } from '../../types';

interface DashboardHomeProps {
  assignments: Assignment[];
  classes: Class[];
  pomodoroSessions: PomodoroSession[];
  user: any;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  assignments,
  classes,
  pomodoroSessions,
  user
}) => {
  const today = new Date().toLocaleDateString();
  const todayClasses = classes.filter(c => c.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const upcomingAssignments = assignments
    .filter(a => !a.completed && new Date(a.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);
  const completedToday = pomodoroSessions.filter(s => 
    s.date === today && s.completed
  ).length;

  const stats = [
    {
      label: 'Today\'s Classes',
      value: todayClasses.length,
      icon: Calendar,
      color: 'from-blue-300 to-cyan-300',
      bgColor: 'from-blue-100 to-cyan-100'
    },
    {
      label: 'Pending Tasks',
      value: upcomingAssignments.length,
      icon: BookOpen,
      color: 'from-purple-300 to-pink-300',
      bgColor: 'from-purple-100 to-pink-100'
    },
    {
      label: 'Focus Sessions',
      value: completedToday,
      icon: Clock,
      color: 'from-green-300 to-teal-300',
      bgColor: 'from-green-100 to-teal-100'
    },
    {
      label: 'Study Streak',
      value: '7 days',
      icon: TrendingUp,
      color: 'from-orange-300 to-red-300',
      bgColor: 'from-orange-100 to-red-100'
    }
  ];

  return (
    <div className="space-y-8 bg-gray-100 min-h-screen p-6">
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl p-8 border border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Ready to make today productive? You've got {todayClasses.length} classes and {upcomingAssignments.length} pending assignments.
            </p>
          </div>
          <div className="text-6xl">🎓</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${stat.bgColor} rounded-2xl p-6 border border-gray-300 hover:border-gray-400 transition-all hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Today's Classes
            </h2>
          </div>
          
          <div className="space-y-3">
            {todayClasses.length > 0 ? (
              todayClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border border-gray-300"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: classItem.color }}
                    ></div>
                    <div>
                      <p className="font-semibold text-gray-800">{classItem.subject}</p>
                      <p className="text-gray-600 text-sm">{classItem.instructor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-medium">
                      {classItem.startTime} - {classItem.endTime}
                    </p>
                    <p className="text-gray-600 text-sm">{classItem.room}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No classes scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
              Upcoming Assignments
            </h2>
          </div>
          
          <div className="space-y-3">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment) => {
                const daysUntilDue = Math.ceil(
                  (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                const priorityColors = {
                  high: 'text-red-600 bg-red-100',
                  medium: 'text-yellow-600 bg-yellow-100',
                  low: 'text-green-600 bg-green-100'
                };

                return (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded-xl border border-gray-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${priorityColors[assignment.priority]}`}>
                        {assignment.priority.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{assignment.title}</p>
                        <p className="text-gray-600 text-sm">{assignment.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-800 font-medium">
                        {daysUntilDue === 0 ? 'Due Today' : `${daysUntilDue} days`}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">All caught up! No pending assignments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-300">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Assignment', icon: BookOpen, color: 'from-purple-200 to-pink-200' },
            { label: 'Start Pomodoro', icon: Clock, color: 'from-green-200 to-teal-200' },
            { label: 'View Timetable', icon: Calendar, color: 'from-blue-200 to-cyan-200' },
            { label: 'Join Club', icon: Users, color: 'from-orange-200 to-red-200' }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className={`p-4 bg-gradient-to-r ${action.color} rounded-xl text-gray-800 font-semibold hover:scale-105 transition-all flex flex-col items-center space-y-2`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
