import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', contact: '' });
  const [selectedIncident, setSelectedIncident] = useState(null);

  const fetchMyIncidents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/incidents/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIncidents(res.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  useEffect(() => { 
    fetchMyIncidents(); 
    // Set up polling to refresh data every 10 seconds
    const interval = setInterval(fetchMyIncidents, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/incidents', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert("Incident Submitted!");
      setForm({ title: '', description: '', contact: '' });
      fetchMyIncidents();
    } catch (error) {
      alert("Error submitting incident");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name}</h1>
          <p className="text-slate-400">User Dashboard</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
        >
          Logout
        </button>
      </div>

      <div className="card backdrop-blur-xl fade-in mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Incident Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            <div className="text-3xl font-bold">{incidents.length}</div>
            <div>Total Incidents</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white">
            <div className="text-3xl font-bold">{incidents.filter(i => i.status === 'resolved').length}</div>
            <div>Resolved</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl text-white">
            <div className="text-3xl font-bold">{incidents.filter(i => i.status === 'pending').length}</div>
            <div>Pending</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="card backdrop-blur-xl fade-in">
          <h3 className="text-xl font-semibold text-white mb-6">Report New Incident</h3>
          <input 
            value={user.name} 
            disabled 
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 mb-4"
          />
          <input 
            value={user.email} 
            disabled 
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 mb-4"
          />
          <input 
            placeholder="Contact Number" 
            value={form.contact}
            onChange={e => setForm({...form, contact: e.target.value})} 
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 mb-4"
            required
          />
          <input 
            placeholder="Incident Title" 
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})} 
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 mb-4"
            required
          />
          <textarea 
            placeholder="Description" 
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})} 
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-vertical min-h-[100px] mb-4"
            required
          />
          <button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            Submit Incident
          </button>
        </form>

        <div className="card backdrop-blur-xl fade-in">
          <h3 className="text-xl font-semibold text-white mb-6">My Incidents</h3>
          <div className="max-h-96 overflow-y-auto">
            {incidents.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No incidents reported yet</p>
            ) : (
              incidents.map(inc => (
                <div 
                  key={inc.id} 
                  className="border-b border-slate-700 p-4 cursor-pointer transition-all duration-200 hover:bg-slate-700/50"
                  onClick={() => setSelectedIncident(inc)}
                >
                  <h4 className="text-white font-medium mb-2">{inc.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inc.status === 'resolved' ? 'status-resolved' :
                      inc.status === 'rejected' ? 'status-rejected' : 'status-pending'
                    }`}>
                      {inc.status.toUpperCase()}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {new Date(inc.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Incident Preview Modal */}
      {selectedIncident && (
        <div className="modal-backdrop fixed inset-0 flex items-center justify-center z-50">
          <div className="card backdrop-blur-xl fade-in max-w-2xl w-full max-h-[80vh] overflow-auto m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Incident Details</h2>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 text-2xl hover:text-white transition-colors duration-200"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <strong className="text-white">Title:</strong>
              <p className="text-slate-300 mt-2">{selectedIncident.title}</p>
            </div>
            <div className="mb-4">
              <strong className="text-white">Description:</strong>
              <p className="text-slate-300 mt-2 whitespace-pre-wrap">{selectedIncident.description}</p>
            </div>
            <div className="mb-4">
              <strong className="text-white">Contact:</strong>
              <p className="text-slate-300 mt-2">{selectedIncident.contact || 'Not provided'}</p>
            </div>
            <div className="mb-4">
              <strong className="text-white">Status:</strong>
              <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                selectedIncident.status === 'resolved' ? 'status-resolved' :
                selectedIncident.status === 'rejected' ? 'status-rejected' : 'status-pending'
              }`}>
                {selectedIncident.status.toUpperCase()}
              </span>
            </div>
            <div className="mb-4">
              <strong className="text-white">Submitted:</strong>
              <p className="text-slate-300 mt-2">
                {new Date(selectedIncident.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}