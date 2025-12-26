import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
// 1. Keep the UI icons from 'fa'
import { FaTimes, FaPaperPlane, FaExpand, FaCompress, FaUser } from 'react-icons/fa';
// 2. Import the NEW modern robot icon from 'ri' (Remix Icons)
import { RiRobot2Fill } from 'react-icons/ri'; 
import api from '../api/axiosConfig';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: "👋 **Hi there!** I'm the **Evently AI**.\n\nI can help you with:\n- finding events 📅\n- checking ticket prices 🎟️\n- vendor verification ✅\n\n*How can I help you today?*" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen, isExpanded]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/chat', { message: userMsg.text });
      const botMsg = { sender: 'bot', text: response.data };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "⚠️ **Connection Error:** I couldn't reach the server." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          {/* 3. Use the new Icon here */}
          <RiRobot2Fill className="toggle-icon" />
        </button>
      )}

      {isOpen && (
        <div className={`chatbot-window ${isExpanded ? 'expanded' : ''}`}>
          
          {/* Header */}
          <div className="chatbot-header">
            <div className="header-info">
              {/* 4. Use the new Icon here */}
              <RiRobot2Fill className="header-icon" />
              <div className="header-text">
                <span className="title">Evently AI</span>
                <span className="status">Online</span>
              </div>
            </div>
            
            <div className="header-controls">
              <button onClick={toggleExpand} title={isExpanded ? "Minimize" : "Expand"}>
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </button>
              <button onClick={() => setIsOpen(false)} title="Close">
                <FaTimes />
              </button>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.sender}`}>
                {/* 5. Use the new Icon for Bot Avatar */}
                {msg.sender === 'bot' && <div className="avatar bot-avatar"><RiRobot2Fill /></div>}
                
                <div className={`message-bubble ${msg.sender}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {msg.sender === 'user' && <div className="avatar user-avatar"><FaUser /></div>}
              </div>
            ))}
            
            {loading && (
              <div className="message-row bot">
                {/* 6. Use the new Icon for Loading Avatar */}
                <div className="avatar bot-avatar"><RiRobot2Fill /></div>
                <div className="message-bubble bot typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form className="chatbot-input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask about events, venues, tickets..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;