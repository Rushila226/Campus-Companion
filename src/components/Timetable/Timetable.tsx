import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Class } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const Timetable: React.FC = () => {
  const [classes, setClasses] = useLocalStorage<Class[]>('campus_classes', []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const colors = [
    '#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B',
    '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'
  ];

  const handleAddClass = (newClass: Omit<Class, 'id'>) => {
    const classWithId = { ...newClass, id: Date.now().toString() };
    setClasses([...classes, classWithId]);
    setShowAddForm(false);
  };

  const handleEditClass = (updatedClass: Class) => {
    setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
    setEditingClass(null);
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const getClassesForTimeSlot = (day: string, timeSlot: string) => {
    return classes.filter(c => c.day === day && c.startTime <= timeSlot && c.endTime > timeSlot);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Class Timetable</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Class</span>
        </button>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-md overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="p-3 text-center font-semibold text-gray-600">Time</div>
            {days.map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-900">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {timeSlots.map(timeSlot => (
            <div key={timeSlot} className="grid grid-cols-8 gap-2 mb-2">
              <div className="p-3 text-center text-sm text-gray-500 font-medium">
                {timeSlot}
              </div>
              {days.map(day => {
                const dayClasses = getClassesForTimeSlot(day, timeSlot);
                return (
                  <div key={`${day}-${timeSlot}`} className="min-h-[60px] bg-indigo-50 rounded-lg p-1">
                    {dayClasses.map(classItem => (
                      <div
                        key={classItem.id}
                        className="relative group h-full p-2 rounded-lg text-gray-900 text-xs cursor-pointer hover:scale-105 transition-all"
                        style={{ backgroundColor: classItem.color + '33' }}
                        onClick={() => setEditingClass(classItem)}
                      >
                        <div className="font-semibold truncate">{classItem.subject}</div>
                        <div className="text-xs opacity-75 truncate">{classItem.room}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClass(classItem.id);
                          }}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-red-500 hover:text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {(showAddForm || editingClass) && (
        <ClassForm
          initialClass={editingClass}
          colors={colors}
          onSave={editingClass ? handleEditClass : handleAddClass}
          onCancel={() => {
            setShowAddForm(false);
            setEditingClass(null);
          }}
        />
      )}
    </div>
  );
};

interface ClassFormProps {
  initialClass?: Class | null;
  colors: string[];
  onSave: (classData: any) => void;
  onCancel: () => void;
}

const ClassForm: React.FC<ClassFormProps> = ({ initialClass, colors, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: initialClass?.subject || '',
    instructor: initialClass?.instructor || '',
    room: initialClass?.room || '',
    day: initialClass?.day || 'Monday',
    startTime: initialClass?.startTime || '9:00 AM',
    endTime: initialClass?.endTime || '10:00 AM',
    color: initialClass?.color || colors[0],
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialClass) {
      onSave({ ...initialClass, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {initialClass ? 'Edit Class' : 'Add New Class'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex space-x-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-900' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <select
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <select
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              {initialClass ? 'Update Class' : 'Add Class'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
