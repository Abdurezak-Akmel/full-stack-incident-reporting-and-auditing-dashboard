import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Verify() {
  const [otp, setOtp] = useState('');
  const email = localStorage.getItem('tempEmail'); 
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      // Sending OTP to the backend for verification
      await axios.post('http://localhost:5000/api/auth/verify', { email, otp });
      
      // Success Notification
      alert("Account successfully verified!");
      
      // Cleanup temporary email and redirect to login
      localStorage.removeItem('tempEmail'); 
      navigate('/'); 
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed. Please check your OTP.");
    }
  };

  return (
    <div className="flex-center" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form 
        className="card" 
        onSubmit={handleVerify} 
        style={{ 
          padding: '2.5rem', 
          background: 'var(--card-dark)', 
          borderRadius: '16px', 
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          maxWidth: '400px',
          width: '90%'
        }}
      >
        <h2 style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>Verify Your Account</h2>
        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: '#94a3b8' }}>
          We've sent a 6-digit OTP to <br />
          <strong style={{ color: 'white' }}>{email || "your email"}</strong>
        </p>
        
        <input 
          type="text" 
          placeholder="000000" 
          value={otp} 
          maxLength="6"
          onChange={(e) => setOtp(e.target.value)} 
          style={{ 
            width: '100%', 
            marginBottom: '20px', 
            textAlign: 'center', 
            fontSize: '1.5rem', 
            letterSpacing: '8px',
            fontWeight: 'bold',
            border: '2px solid #334155'
          }}
          required
        />
        
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            fontSize: '1rem', 
            textTransform: 'uppercase' 
          }}
        >
          Verify Account
        </button>
        
        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#64748b' }}>
          Didn't receive a code? Check your spam folder.
        </p>
      </form>
    </div>
  );
}