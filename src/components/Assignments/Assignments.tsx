/*
import React, { useState } from 'react';
import { Plus, Calendar, AlertCircle, CheckCircle, Trash2, Edit } from 'lucide-react';
import { Assignment } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>('campus_assignments', []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleAddAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const assignmentWithId = {
      ...newAssignment,
      id: Date.now().toString(),
    };
    setAssignments([...assignments, assignmentWithId]);
    setShowAddForm(false);
  };

  const handleEditAssignment = (updatedAssignment: Assignment) => {
    setAssignments(assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));
    setEditingAssignment(null);
  };

  const handleToggleComplete = (id: string) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'completed') return assignment.completed;
    if (filter === 'pending') return !assignment.completed;
    return true;
  });

  const sortedAssignments = filteredAssignments.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-200 border-red-300';
      case 'medium': return 'text-yellow-700 bg-yellow-200 border-yellow-300';
      case 'low': return 'text-green-700 bg-green-200 border-green-300';
      default: return 'text-purple-700 bg-purple-200 border-purple-300';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-purple-900">Assignments</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Assignment</span>
        </button>
      </div>

      <div className="flex space-x-1 bg-purple-200/40 backdrop-blur-xl rounded-xl p-1">
        {['all', 'pending', 'completed'].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              filter === key
                ? 'bg-purple-300 text-purple-900 font-semibold'
                : 'text-purple-700 hover:bg-purple-300/50 hover:text-purple-900'
            }`}
          >
            {key[0].toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sortedAssignments.length > 0 ? (
          sortedAssignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue === 'Overdue' && !assignment.completed;
            
            return (
              <div
                key={assignment.id}
                className={`bg-purple-100/30 backdrop-blur-xl rounded-2xl p-6 border transition-all ${
                  assignment.completed 
                    ? 'border-green-400 bg-green-100/30' 
                    : isOverdue 
                    ? 'border-red-400 bg-red-100/30'
                    : 'border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <button
                      onClick={() => handleToggleComplete(assignment.id)}
                      className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        assignment.completed
                          ? 'bg-green-400 border-green-400 text-white'
                          : 'border-purple-400 hover:border-green-400'
                      }`}
                    >
                      {assignment.completed && <CheckCircle className="w-4 h-4" />}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-semibold ${
                          assignment.completed ? 'text-purple-400 line-through' : 'text-purple-900'
                        }`}>
                          {assignment.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-purple-700 mb-3">{assignment.subject}</p>
                      {assignment.description && (
                        <p className="text-purple-600 text-sm mb-3">{assignment.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-purple-700">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${
                          isOverdue ? 'text-red-500' : 'text-purple-700'
                        }`}>
                          <AlertCircle className="w-4 h-4" />
                          <span>{daysUntilDue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingAssignment(assignment)}
                      className="p-2 text-purple-700 hover:text-indigo-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="p-2 text-purple-700 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-purple-800 mb-2">No assignments found</h3>
            <p className="text-purple-500">
              {filter === 'all' 
                ? 'Add your first assignment to get started'
                : filter === 'pending' 
                ? 'All caught up! No pending assignments'
                : 'No completed assignments yet'}
            </p>
          </div>
        )}
      </div>

      {(showAddForm || editingAssignment) && (
        <AssignmentForm
          initialAssignment={editingAssignment}
          onSave={editingAssignment ? handleEditAssignment : handleAddAssignment}
          onCancel={() => {
            setShowAddForm(false);
            setEditingAssignment(null);
          }}
        />
      )}
    </div>
  );
};

interface AssignmentFormProps {
  initialAssignment?: Assignment | null;
  onSave: (assignment: any) => void;
  onCancel: () => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ initialAssignment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialAssignment?.title || '',
    subject: initialAssignment?.subject || '',
    description: initialAssignment?.description || '',
    dueDate: initialAssignment?.dueDate || '',
    priority: initialAssignment?.priority || 'medium',
    completed: initialAssignment?.completed || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialAssignment) {
      onSave({ ...initialAssignment, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-purple-100 rounded-2xl p-6 border border-purple-300 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold text-purple-900 mb-6">
          {initialAssignment ? 'Edit Assignment' : 'Add New Assignment'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {['title', 'subject'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                {field[0].toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                value={formData[field as keyof typeof formData] as string}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full px-4 py-3 bg-purple-200 border border-purple-300 rounded-xl text-purple-900 placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-purple-200 border border-purple-300 rounded-xl text-purple-900 placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 bg-purple-200 border border-purple-300 rounded-xl text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 bg-purple-200 border border-purple-300 rounded-xl text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-400 to-indigo-400 text-white py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all"
            >
              {initialAssignment ? 'Update Assignment' : 'Add Assignment'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-purple-200 text-purple-900 py-3 rounded-xl font-semibold hover:bg-purple-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
*/
import React, { useState } from 'react';
import { Plus, Calendar, AlertCircle, CheckCircle, Trash2, Edit } from 'lucide-react';
import { Assignment } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>('campus_assignments', []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleAddAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const assignmentWithId = {
      ...newAssignment,
      id: Date.now().toString(),
    };
    setAssignments([...assignments, assignmentWithId]);
    setShowAddForm(false);
  };

  const handleEditAssignment = (updatedAssignment: Assignment) => {
    setAssignments(assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));
    setEditingAssignment(null);
  };

  const handleToggleComplete = (id: string) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'completed') return assignment.completed;
    if (filter === 'pending') return !assignment.completed;
    return true;
  });

  const sortedAssignments = filteredAssignments.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-200 border-red-300';
      case 'medium': return 'text-yellow-700 bg-yellow-200 border-yellow-300';
      case 'low': return 'text-green-700 bg-green-200 border-green-300';
      default: return 'text-blue-700 bg-blue-200 border-blue-300';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <div className="space-y-6 bg-blue-50 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-900">Assignments</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Assignment</span>
        </button>
      </div>

      <div className="flex space-x-1 bg-blue-200/40 backdrop-blur-xl rounded-xl p-1">
        {['all', 'pending', 'completed'].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              filter === key
                ? 'bg-blue-300 text-blue-900 font-semibold'
                : 'text-blue-700 hover:bg-blue-300/50 hover:text-blue-900'
            }`}
          >
            {key[0].toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sortedAssignments.length > 0 ? (
          sortedAssignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue === 'Overdue' && !assignment.completed;

            return (
              <div
                key={assignment.id}
                className={`bg-white rounded-2xl p-6 border transition-all shadow-md ${
                  assignment.completed
                    ? 'border-green-400'
                    : isOverdue
                    ? 'border-red-400'
                    : 'border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <button
                      onClick={() => handleToggleComplete(assignment.id)}
                      className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        assignment.completed
                          ? 'bg-green-400 border-green-400 text-white'
                          : 'border-blue-400 hover:border-green-400'
                      }`}
                    >
                      {assignment.completed && <CheckCircle className="w-4 h-4" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-semibold ${
                          assignment.completed ? 'text-blue-400 line-through' : 'text-blue-900'
                        }`}>
                          {assignment.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-blue-700 mb-3">{assignment.subject}</p>
                      {assignment.description && (
                        <p className="text-blue-600 text-sm mb-3">{assignment.description}</p>
                      )}

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-blue-700">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${
                          isOverdue ? 'text-red-500' : 'text-blue-700'
                        }`}>
                          <AlertCircle className="w-4 h-4" />
                          <span>{daysUntilDue}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingAssignment(assignment)}
                      className="p-2 text-blue-700 hover:text-indigo-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="p-2 text-blue-700 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-800 mb-2">No assignments found</h3>
            <p className="text-blue-500">
              {filter === 'all' 
                ? 'Add your first assignment to get started'
                : filter === 'pending' 
                ? 'All caught up! No pending assignments'
                : 'No completed assignments yet'}
            </p>
          </div>
        )}
      </div>

      {(showAddForm || editingAssignment) && (
        <AssignmentForm
          initialAssignment={editingAssignment}
          onSave={editingAssignment ? handleEditAssignment : handleAddAssignment}
          onCancel={() => {
            setShowAddForm(false);
            setEditingAssignment(null);
          }}
        />
      )}
    </div>
  );
};

// The AssignmentForm component would be reused as-is or with similar light-theme adaptations.