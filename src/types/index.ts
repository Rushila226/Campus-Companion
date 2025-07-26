export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Class {
  id: string;
  subject: string;
  instructor: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
  color: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  description: string;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  meetingTime: string;
  location: string;
  category: string;
  members: number;
}

export interface PomodoroSession {
  id: string;
  duration: number;
  completed: boolean;
  date: string;
  subject: string;
}

export interface StudyStats {
  totalStudyTime: number;
  completedPomodoros: number;
  completedAssignments: number;
  weeklyGoal: number;
}