import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import "./EventsPage.css";
import { motion } from "framer-motion";
import Slider from "react-slick";

/* If you didn't include slick CSS globally in index.jsx, uncomment:
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
*/

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const sliderSettings = {
    dots: true,
    dotsClass: "slick-dots", // keep our custom CSS selector
    appendDots: (dots) => <div>{dots}</div>, // ensures dots are inside the slider element so absolute positioning works
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    adaptiveHeight: false, // important: prevent slick from changing height or adding space
    pauseOnHover: true,
  };

  return (
    <div className="events-page-container">
      <h1>All Events</h1>
      <p>Hover to explore the vibe — click to dive in.</p>

      {loading ? (
        <h1>Loading Events...</h1>
      ) : events.length === 0 ? (
        <h1>No events have been created yet.</h1>
      ) : (
        <motion.div
          className="event-grid"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {events.map((event) => (
            <motion.div
              className="event-card"
              key={event.id}
              variants={cardVariants}
            >
              <Link to={`/events/${event.id}`} className="event-card-link">
                <div className="event-card-image-container">
                  {event.imageUrls && event.imageUrls.length > 1 ? (
                    <Slider {...sliderSettings}>
                      {event.imageUrls.map((img, idx) => {
                        const src = img?.startsWith?.("http")
                          ? img
                          : `http://localhost:8081${img}`;
                        return (
                          <div key={idx} className="slick-slide-inner">
                            <img
                              src={src}
                              alt={`${event.eventName}-${idx}`}
                            />
                          </div>
                        );
                      })}
                    </Slider>
                  ) : (
                    <img
                      className="static-image"
                      src={
                        event.imageUrls && event.imageUrls.length > 0
                          ? (event.imageUrls[0].startsWith("http")
                              ? event.imageUrls[0]
                              : `http://localhost:8081${event.imageUrls[0]}`)
                          : "https://placehold.co/400x500/0f0f23/FF00FF?text=No+Image"
                      }
                      alt={event.eventName}
                    />
                  )}
                </div>

                <div className="event-card-content">
                  <h3>{event.eventName}</h3>
                  <p>
                    {event.categoryName} | {event.location}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default EventsPage;
