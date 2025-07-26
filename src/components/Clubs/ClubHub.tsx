/*import React, { useState } from 'react';
import { Users, MapPin, Clock, Plus, Search, Star, Calendar } from 'lucide-react';
import { Club } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const ClubHub: React.FC = () => {
  const [clubs, setClubs] = useLocalStorage<Club[]>('campus_clubs', [
    {
      id: '1',
      name: 'Computer Science Society',
      description: 'Learn programming, participate in hackathons, and network with tech professionals.',
      meetingTime: 'Fridays 4:00 PM - 6:00 PM',
      location: 'Tech Building Room 101',
      category: 'Academic',
      members: 45,
    },
    {
      id: '2',
      name: 'Photography Club',
      description: 'Capture moments, learn techniques, and explore campus through the lens.',
      meetingTime: 'Wednesdays 3:00 PM - 5:00 PM',
      location: 'Art Center Studio B',
      category: 'Creative',
      members: 32,
    },
    {
      id: '3',
      name: 'Debate Society',
      description: 'Develop critical thinking and public speaking skills through structured debates.',
      meetingTime: 'Tuesdays 6:00 PM - 8:00 PM',
      location: 'Main Building Hall A',
      category: 'Academic',
      members: 28,
    },
    {
      id: '4',
      name: 'Environmental Action Group',
      description: 'Make a positive impact on campus sustainability and environmental awareness.',
      meetingTime: 'Thursdays 5:00 PM - 6:30 PM',
      location: 'Student Center Room 205',
      category: 'Service',
      members: 67,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [joinedClubs, setJoinedClubs] = useLocalStorage<string[]>('campus_joined_clubs', []);

  const categories = ['all', 'Academic', 'Creative', 'Sports', 'Service', 'Social'];

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinClub = (clubId: string) => {
    if (joinedClubs.includes(clubId)) {
      setJoinedClubs(joinedClubs.filter(id => id !== clubId));
    } else {
      setJoinedClubs([...joinedClubs, clubId]);
    }
  };

  const handleAddClub = (newClub: Omit<Club, 'id'>) => {
    const clubWithId = {
      ...newClub,
      id: Date.now().toString(),
    };
    setClubs([...clubs, clubWithId]);
    setShowAddForm(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Academic': return '📚';
      case 'Creative': return '🎨';
      case 'Sports': return '⚽';
      case 'Service': return '🤝';
      case 'Social': return '🎉';
      default: return '🏛️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Campus Clubs</h1>
          <p className="text-gray-300">Discover and join clubs that match your interests</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Club</span>
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category === 'all' ? 'All' : `${getCategoryIcon(category)} ${category}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {joinedClubs.length > 0 && (
        <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
          <div className="flex items-center space-x-3 mb-3">
            <Star className="w-6 h-6 text-green-400" />
            <h2 className="text-lg font-bold text-white">Your Clubs</h2>
          </div>
          <p className="text-gray-300 mb-4">You're a member of {joinedClubs.length} club{joinedClubs.length !== 1 ? 's' : ''}</p>
          <div className="flex flex-wrap gap-2">
            {clubs
              .filter(club => joinedClubs.includes(club.id))
              .map(club => (
                <span
                  key={club.id}
                  className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm font-medium border border-green-500/30"
                >
                  {club.name}
                </span>
              ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map(club => {
          const isJoined = joinedClubs.includes(club.id);
          
          return (
            <div
              key={club.id}
              className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 border transition-all hover:border-white/20 hover:scale-105 ${
                isJoined ? 'border-green-500/30 bg-green-500/5' : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{getCategoryIcon(club.category)}</div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium">
                  {club.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{club.name}</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{club.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{club.meetingTime}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{club.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{club.members} members</span>
                </div>
              </div>
              
              <button
                onClick={() => handleJoinClub(club.id)}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  isJoined
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                }`}
              >
                {isJoined ? '✓ Joined' : 'Join Club'}
              </button>
            </div>
          );
        })}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No clubs found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to add a club to the hub!'
            }
          </p>
        </div>
      )}

      {showAddForm && (
        <ClubForm
          onSave={handleAddClub}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

interface ClubFormProps {
  onSave: (club: Omit<Club, 'id'>) => void;
  onCancel: () => void;
}

const ClubForm: React.FC<ClubFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    meetingTime: '',
    location: '',
    category: 'Academic',
    members: 1,
  });

  const categories = ['Academic', 'Creative', 'Sports', 'Service', 'Social'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">Add New Club</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Club Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Meeting Time</label>
            <input
              type="text"
              value={formData.meetingTime}
              onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
              placeholder="e.g., Fridays 4:00 PM - 6:00 PM"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Tech Building Room 101"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Initial Members</label>
              <input
                type="number"
                min="1"
                value={formData.members}
                onChange={(e) => setFormData({ ...formData, members: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Add Club
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
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
import { Users, MapPin, Clock, Plus, Search, Star } from 'lucide-react';
import { Club } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const ClubHub: React.FC = () => {
  const [clubs, setClubs] = useLocalStorage<Club[]>('campus_clubs', [
    {
      id: '1',
      name: 'Computer Science Society',
      description: 'Learn programming, participate in hackathons, and network with tech professionals.',
      meetingTime: 'Fridays 4:00 PM - 6:00 PM',
      location: 'Tech Building Room 101',
      category: 'Academic',
      members: 45,
    },
    {
      id: '2',
      name: 'Photography Club',
      description: 'Capture moments, learn techniques, and explore campus through the lens.',
      meetingTime: 'Wednesdays 3:00 PM - 5:00 PM',
      location: 'Art Center Studio B',
      category: 'Creative',
      members: 32,
    },
    {
      id: '3',
      name: 'Debate Society',
      description: 'Develop critical thinking and public speaking skills through structured debates.',
      meetingTime: 'Tuesdays 6:00 PM - 8:00 PM',
      location: 'Main Building Hall A',
      category: 'Academic',
      members: 28,
    },
    {
      id: '4',
      name: 'Environmental Action Group',
      description: 'Make a positive impact on campus sustainability and environmental awareness.',
      meetingTime: 'Thursdays 5:00 PM - 6:30 PM',
      location: 'Student Center Room 205',
      category: 'Service',
      members: 67,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [joinedClubs, setJoinedClubs] = useLocalStorage<string[]>('campus_joined_clubs', []);

  const categories = ['all', 'Academic', 'Creative', 'Sports', 'Service', 'Social'];

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinClub = (clubId: string) => {
    if (joinedClubs.includes(clubId)) {
      setJoinedClubs(joinedClubs.filter(id => id !== clubId));
    } else {
      setJoinedClubs([...joinedClubs, clubId]);
    }
  };

  const handleAddClub = (newClub: Omit<Club, 'id'>) => {
    const clubWithId = {
      ...newClub,
      id: Date.now().toString(),
    };
    setClubs([...clubs, clubWithId]);
    setShowAddForm(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Academic': return '📚';
      case 'Creative': return '🎨';
      case 'Sports': return '⚽';
      case 'Service': return '🤝';
      case 'Social': return '🎉';
      default: return '🏛️';
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/campus.jpg')" }}
    >
      <div className="space-y-6 px-4 py-6 backdrop-blur-md bg-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Clubs</h1>
            <p className="text-gray-700">Discover and join clubs that match your interests</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Club</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/60">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/50 text-gray-700 hover:bg-white hover:text-black'
                  }`}
                >
                  {category === 'all' ? 'All' : `${getCategoryIcon(category)} ${category}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Joined Clubs Summary */}
        {joinedClubs.length > 0 && (
          <div className="bg-green-100/60 rounded-2xl p-6 border border-green-300">
            <div className="flex items-center space-x-3 mb-3">
              <Star className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-bold text-gray-800">Your Clubs</h2>
            </div>
            <p className="text-gray-700 mb-4">You're a member of {joinedClubs.length} club{joinedClubs.length !== 1 ? 's' : ''}</p>
            <div className="flex flex-wrap gap-2">
              {clubs
                .filter(club => joinedClubs.includes(club.id))
                .map(club => (
                  <span
                    key={club.id}
                    className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-sm font-medium border border-green-300"
                  >
                    {club.name}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map(club => {
            const isJoined = joinedClubs.includes(club.id);

            return (
              <div
                key={club.id}
                className={`bg-white/70 rounded-2xl p-6 border shadow-md transition-all hover:shadow-lg ${
                  isJoined ? 'border-green-400' : 'border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{getCategoryIcon(club.category)}</div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                    {club.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{club.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{club.description}</p>

                <div className="space-y-2 mb-4 text-gray-500 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{club.meetingTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{club.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{club.members} members</span>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinClub(club.id)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isJoined
                      ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                  }`}
                >
                  {isJoined ? '✓ Joined' : 'Join Club'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No clubs found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to add a club to the hub!'}
            </p>
          </div>
        )}

        {/* Add Club Modal */}
        {showAddForm && (
          <ClubForm
            onSave={handleAddClub}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
};

interface ClubFormProps {
  onSave: (club: Omit<Club, 'id'>) => void;
  onCancel: () => void;
}

const ClubForm: React.FC<ClubFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    meetingTime: '',
    location: '',
    category: 'Academic',
    members: 1,
  });

  const categories = ['Academic', 'Creative', 'Sports', 'Service', 'Social'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 rounded-2xl p-6 border border-gray-200 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Club</h2>
        {/* your form goes here... */}
      </div>
    </div>
  );
};
