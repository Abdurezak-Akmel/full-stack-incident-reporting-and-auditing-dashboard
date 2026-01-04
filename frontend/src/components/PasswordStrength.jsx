export default function PasswordStrength({ password }) {
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length > 7) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const score = getStrength(password);
  const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  
  return (
    <div style={{ marginTop: '5px' }}>
      <div style={{ height: '5px', width: '100%', background: '#334155', borderRadius: '5px' }}>
        <div style={{ 
            height: '100%', 
            width: `${(score / 4) * 100}%`, 
            background: colors[score - 1] || '#334155', 
            transition: '0.3s' 
        }} />
      </div>
      <small>Strength: {['Weak', 'Fair', 'Good', 'Strong'][score - 1] || 'None'}</small>
    </div>
  );
}