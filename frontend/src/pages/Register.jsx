import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PasswordStrength from '../components/PasswordStrength';

export default function Register() {
  const [step, setStep] = useState(1); // 1: Select Role, 2: Form
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', adminCode: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Passwords do not match");
    try {
      await axios.post('http://localhost:5000/api/auth/register', { ...form, role });
      localStorage.setItem('tempEmail', form.email);
      alert("OTP sent to your email!");
      navigate('/verify');
    } catch (err) { alert(err.response.data.message); }
  };

  if (step === 1) return (
    <div className="flex-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="card backdrop-blur-xl fade-in" style={{ width: '400px' }}>
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Join Us As
        </h2>
        <button 
          onClick={() => {setRole('user'); setStep(2)}}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 mb-4"
        >
          Normal User
        </button>
        <button 
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          onClick={() => {setRole('admin'); setStep(2)}}
        >
          Administrator
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <form onSubmit={handleRegister} className="card backdrop-blur-xl fade-in" style={{ width: '400px' }}>
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          {role.toUpperCase()} Account
        </h2>
        <input 
          placeholder="Full Name" 
          required 
          onChange={e => setForm({...form, name: e.target.value})} 
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 mb-4"
        />
        <input 
          placeholder="Email" 
          type="email" 
          required 
          onChange={e => setForm({...form, email: e.target.value})} 
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 mb-4"
        />
        <input 
          placeholder="Password" 
          type="password" 
          required 
          onChange={e => setForm({...form, password: e.target.value})} 
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 mb-4"
        />
        <PasswordStrength password={form.password} />
        <input 
          placeholder="Confirm Password" 
          type="password" 
          required 
          onChange={e => setForm({...form, confirm: e.target.value})} 
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 mb-4"
        />
        {role === 'admin' && (
          <input 
            placeholder="Admin Registration Code" 
            required 
            onChange={e => setForm({...form, adminCode: e.target.value})} 
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 mb-4"
          />
        )}
        <button 
          type="submit" 
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 mt-4"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}