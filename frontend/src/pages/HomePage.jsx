import React, { useState } from 'react'; // 1. We still need useState
import { Link } from 'react-router-dom';
import './HomePage.css';
import { FaTicketAlt } from 'react-icons/fa';
import { motion } from 'framer-motion'; 

function HomePage() {
  // 2. This mouse-tracking logic is still correct
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 50; // Subtle movement
    const y = (clientY - window.innerHeight / 2) / 50;
    setMousePosition({ x, y });
  };

  // Animation for sections below the hero
  const fadeInAnimation = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="homepage-container">
      {/* 3. The onMouseMove listener stays on the main header */}
      <header className="hero-section" onMouseMove={handleMouseMove}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video"
          src="/hero-video.mp4" 
        />
        <div className="hero-overlay"></div>
        
        {/* 4. This outer 'motion.div' ONLY handles the SLIDE-UP animation */}
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.2,
            delay: 0.5,
            ease: "easeOut"
          }}
        >
          {/* 5. This NEW inner 'div' ONLY handles the MOUSE PARALLAX */}
          <div
            className="hero-content-parallax"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) rotateX(${-mousePosition.y / 10}deg) rotateY(${mousePosition.x / 10}deg)`
            }}
          >
            <h1>Welcome to Evently</h1>
            <p>Your one-stop solution for seamless event planning and booking.</p>
            <Link to="/events" className="cta-button">Browse All Events</Link>
          </div>
        </motion.div>
      </header>

      {/* 2. Featured Events Section (stays the same) */}
      <motion.section 
        className="featured-events"
        // ... (rest of the section is the same)
      >
        <h2>Featured Events</h2>
        {/* ... (event cards) ... */}
      </motion.section>
    </div>
  );
}

export default HomePage;