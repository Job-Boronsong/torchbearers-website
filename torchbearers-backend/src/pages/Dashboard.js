import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ token, setToken }) => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
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
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    navigate('/login');
  };

  useEffect(() => {
    if (token) fetchMessages();
    else navigate('/login');
  }, [token]);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <ul>
        {messages.map(msg => (
          <li key={msg._id}>
            <p><strong>{msg.name}</strong> ({msg.email})</p>
            <p>{msg.message}</p>
            <button onClick={() => replyMessage(msg.email)}>Reply</button>
            <button onClick={() => deleteMessage(msg._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
