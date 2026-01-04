import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Form
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({ code: '', newPassword: '', confirm: '' });
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      alert("Recovery code sent to your email!");
      setStep(2);
    } catch (err) { alert(err.response.data.message); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return alert("Passwords match error");
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { 
        email, code: form.code, newPassword: form.newPassword 
      });
      alert("Password changed! Redirecting to login...");
      navigate('/');
    } catch (err) { alert(err.response.data.message); }
  };

  return (
    <div className="flex-center" style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
      {step === 1 ? (
        <form className="card" onSubmit={handleSendCode}>
          <h2>Recover Password</h2>
          <input type="email" placeholder="Enter your email" required onChange={e => setEmail(e.target.value)} />
          <button type="submit" style={{marginTop:'10px'}}>Send Recovery Code</button>
        </form>
      ) : (
        <form className="card" onSubmit={handleReset}>
          <h2>Set New Password</h2>
          <input placeholder="Recovery Code" required onChange={e => setForm({...form, code: e.target.value})} />
          <input type="password" placeholder="New Password" required onChange={e => setForm({...form, newPassword: e.target.value})} />
          <input type="password" placeholder="Confirm New Password" required onChange={e => setForm({...form, confirm: e.target.value})} />
          <button type="submit" style={{marginTop:'10px'}}>Update Password</button>
        </form>
      )}
    </div>
  );
}