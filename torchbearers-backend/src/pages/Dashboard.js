import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`/api/admin/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.filter(msg => msg._id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Could not delete message.');
    }
  };

  const replyMessage = async (email) => {
    const reply = prompt('Enter your reply message:');
    if (!reply) return;
    try {
      await axios.post('/api/admin/reply', { email, message: reply }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Reply sent!');
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Failed to send reply.');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
    } else {
      navigate('/');
    }
  }, [token]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="message-list">
          {messages.length === 0 ? (
            <p>No messages available.</p>
          ) : (
            messages.map(msg => (
              <div key={msg._id} className="message-card">
                <p><strong>{msg.name}</strong> (<em>{msg.email}</em>)</p>
                <p>{msg.message}</p>
                <div className="message-actions">
                  <button onClick={() => replyMessage(msg.email)}>Reply</button>
                  <button onClick={() => deleteMessage(msg._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
