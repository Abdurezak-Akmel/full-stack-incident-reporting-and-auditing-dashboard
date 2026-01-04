import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      if (res.data.role === 'admin') navigate('/admin-dashboard');
      else navigate('/user-dashboard');
    } catch (err) { alert(err.response.data.message); }
  };

  return (
    <div className="flex-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <form onSubmit={handleLogin} className="card backdrop-blur-xl fade-in" style={{ width: '400px' }}>
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Incident Reporting and Review Portal
        </h2>
        <input 
          type="email" 
          placeholder="Email" 
          required
          onChange={(e) => setForm({...form, email: e.target.value})} 
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
        <div className="h-4"></div>
        <input 
          type="password" 
          placeholder="Password" 
          required
          onChange={(e) => setForm({...form, password: e.target.value})} 
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
        <div className="h-4"></div>
        <button 
          type="submit" 
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
        >
          Login
        </button>
        <button 
          type="button" 
          onClick={() => navigate('/register')} 
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 mt-3"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}