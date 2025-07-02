import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './pages/Login'; // Assuming Login is the component handling the form UI
import './App.css'; // Optional global styling

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [messages, setMessages] = useState([]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Delete message
  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`/api/admin/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Reply to message
  const replyMessage = async (email) => {
    const reply = prompt('Enter your reply message:');
    if (!reply) return;
    try {
      await axios.post(
        '/api/admin/reply',
        { email, message: reply },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Reply sent!');
    } catch (err) {
      console.error('Error sending reply:', err);
    }
  };

  useEffect(() => {
    if (token) fetchMessages();
  }, [token]);

  // Render Login UI if not logged in
  if (!token) {
    return <Login onLoginSuccess={(token) => setToken(token)} />;
  }

  // Render Dashboard
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {messages.map((msg) => (
          <li key={msg._id}>
            <p>
              <strong>{msg.name}</strong> ({msg.email})
            </p>
            <p>{msg.message}</p>
            <button onClick={() => replyMessage(msg.email)}>Reply</button>
            <button onClick={() => deleteMessage(msg._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
