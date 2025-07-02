import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [error, setError] = useState('');

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      setToken(res.data.token);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

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

  useEffect(() => {
    if (token) fetchMessages();
  }, [token]);

  if (!token) {
    return (
      <div className="login-form">
        <h2>Admin Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button onClick={() => {
        localStorage.removeItem('adminToken');
        setToken(null);
      }}>Logout</button>
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

export default AdminDashboard;
