import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../utils/api';

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters long');
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      setMessage(res.data.message || 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Settings</h1>
        </div>

        <div className="admin-content">
          <div className="form-container" style={{ maxWidth: 500, margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Change Password</h2>
            
            {message && <div className="alert success" style={{ padding: '1rem', background: '#e6f4ea', color: '#1a5c38', marginBottom: '1rem', borderRadius: '8px' }}>{message}</div>}
            {error && <div className="alert error" style={{ padding: '1rem', background: '#fce8e6', color: '#c5221f', marginBottom: '1rem', borderRadius: '8px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', marginTop: '0.5rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', marginTop: '0.5rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', marginTop: '0.5rem' }}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                background: '#1a5c38', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: 'bold'
              }}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
