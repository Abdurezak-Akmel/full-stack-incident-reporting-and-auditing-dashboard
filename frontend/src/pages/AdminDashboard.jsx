import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState({ email: '', status: '' });
  const [adminEmail, setAdminEmail] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  const fetchAll = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/incidents/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIncidents(res.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  useEffect(() => { 
    fetchAll(); 
    // Set up polling to refresh data every 10 seconds
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/incidents/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAll();
    } catch (error) {
      alert("Error updating status");
    }
  };

  const sendAdminInvite = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/send-admin-code', { email: adminEmail }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert("Invite Code Sent!");
      setAdminEmail('');
    } catch (error) {
      alert("Error sending invite");
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

  const filteredIncidents = incidents.filter(inc => 
    inc.email.includes(filter.email) && (filter.status === '' || inc.status === filter.status)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Console</h1>
          <p className="text-slate-400">Incident Management Portal</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
        >
          Logout
        </button>
      </div>

      <div className="card backdrop-blur-xl fade-in mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Admin Invite</h3>
        <div className="flex gap-4 items-center">
          <input 
            placeholder="New Admin Email" 
            value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
          <button 
            onClick={sendAdminInvite}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            Send Invite Code
          </button>
        </div>
      </div>

      <div className="card backdrop-blur-xl fade-in mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Incident Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            <div className="text-3xl font-bold">{filteredIncidents.length}</div>
            <div>Total Incidents</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white">
            <div className="text-3xl font-bold">{filteredIncidents.filter(i => i.status === 'resolved').length}</div>
            <div>Resolved</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl text-white">
            <div className="text-3xl font-bold">{filteredIncidents.filter(i => i.status === 'pending').length}</div>
            <div>Pending</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white">
            <div className="text-3xl font-bold">{filteredIncidents.filter(i => i.status === 'rejected').length}</div>
            <div>Rejected</div>
          </div>
        </div>
      </div>

      <div className="card backdrop-blur-xl fade-in mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Filters</h3>
        <div className="flex gap-4 items-center flex-wrap">
          <input 
            placeholder="Filter by User Email" 
            value={filter.email}
            onChange={e => setFilter({...filter, email: e.target.value})}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[200px]"
          />
          <select 
            value={filter.status}
            onChange={e => setFilter({...filter, status: e.target.value})}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[150px]"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <h3 className="text-white m-0">Total: {filteredIncidents.length}</h3>
        </div>
      </div>

      <div className="card backdrop-blur-xl fade-in">
        <h3 className="text-xl font-semibold text-white mb-6">Incidents Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-700">
                <th className="p-4 text-white">User</th>
                <th className="p-4 text-white">Title</th>
                <th className="p-4 text-white">Date</th>
                <th className="p-4 text-white">Status</th>
                <th className="p-4 text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-slate-400">
                    No incidents found
                  </td>
                </tr>
              ) : (
                filteredIncidents.map(inc => (
                  <tr 
                    key={inc.id} 
                    className="border-b border-slate-700 cursor-pointer transition-all duration-200 hover:bg-slate-700/50"
                    onClick={() => setSelectedIncident(inc)}
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-white">{inc.full_name}</div>
                        <div className="text-sm text-slate-400">{inc.email}</div>
                      </div>
                    </td>
                    <td className="p-4 text-white">{inc.title}</td>
                    <td className="p-4 text-slate-400">
                      {new Date(inc.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        inc.status === 'resolved' ? 'status-resolved' :
                        inc.status === 'rejected' ? 'status-rejected' : 'status-pending'
                      }`}>
                        {inc.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateStatus(inc.id, 'resolved'); }}
                          className="px-3 py-1 bg-green-500 border-none rounded text-white text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-green-600"
                        >
                          Resolve
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateStatus(inc.id, 'rejected'); }}
                          className="px-3 py-1 bg-red-500 border-none rounded text-white text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Preview Modal */}
      {selectedIncident && (
        <div className="modal-backdrop fixed inset-0 flex items-center justify-center z-50">
          <div className="card backdrop-blur-xl fade-in max-w-4xl w-full max-h-[80vh] overflow-auto m-4">
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
              <strong className="text-white">Submitted by:</strong>
              <p className="text-slate-300 mt-2">
                {selectedIncident.full_name} ({selectedIncident.email})
              </p>
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
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => { updateStatus(selectedIncident.id, 'resolved'); setSelectedIncident(null); }}
                className="flex-1 px-4 py-3 bg-green-500 border-none rounded-lg text-white font-semibold cursor-pointer transition-all duration-200 hover:bg-green-600"
              >
                Mark as Resolved
              </button>
              <button 
                onClick={() => { updateStatus(selectedIncident.id, 'rejected'); setSelectedIncident(null); }}
                className="flex-1 px-4 py-3 bg-red-500 border-none rounded-lg text-white font-semibold cursor-pointer transition-all duration-200 hover:bg-red-600"
              >
                Mark as Rejected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}