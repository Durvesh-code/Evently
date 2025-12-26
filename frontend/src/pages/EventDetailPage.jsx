import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { ModalContext } from '../context/ModalContext';
import './EventDetailPage.css'; 
import { PayPalButtons } from '@paypal/react-paypal-js';

function EventDetailPage() {
  const { id: eventId } = useParams(); 
  const { user } = useContext(AuthContext);
  const { openModal } = useContext(ModalContext);
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch event and ticket data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch event details
        const eventResponse = await api.get(`/events/${eventId}`);
        setEvent(eventResponse.data);

        // Fetch ticket types for this event
        const ticketsResponse = await api.get(`/events/${eventId}/tickets`);
        setTickets(ticketsResponse.data);
        
        setError('');
      } catch (err) {
        console.error("Failed to fetch event data", err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);


  // --- PAYPAL: Create Order Function ---
  const createOrder = async (data, actions) => {
    // 1. Check User Login
    if (!user) {
      setMessage('Please log in to book a ticket.');
      openModal('login');
      throw new Error('User not logged in');
    }

    // 2. Validate Ticket Selection
    const ticket = tickets.find(t => t.id === parseInt(selectedTicketId));
    if (!ticket) {
      setMessage("Please select a ticket type first.");
      throw new Error("No ticket selected");
    }

    // 3. Validate ticket price
    if (!ticket.price || ticket.price <= 0) {
      setMessage("Invalid ticket price.");
      throw new Error("Invalid ticket price");
    }

    // 4. Call Backend to Create PayPal Order
    try {
      setMessage("Creating payment order...");
      const response = await api.post('/payment/create-paypal-order', {
        amount: ticket.price,
        eventId: parseInt(eventId),
        ticketId: parseInt(selectedTicketId),
      });

      const order = response.data;
      
      if (order && order.id) {
        console.log("Order created successfully:", order.id);
        setMessage("");
        return order.id; // Return the PayPal Order ID to the button
      } else {
        throw new Error(order?.error || "No order ID returned from backend");
      }
    } catch (err) {
      console.error("Create Order Error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Could not initiate payment. Please try again.";
      setMessage("❌ " + errorMsg);
      throw err;
    }
  };


  // --- PAYPAL: On Approve (Capture) Function ---
  const onApprove = async (data, actions) => {
    try {
      setMessage("Processing payment...");
      
      // 1. Validate order ID
      if (!data.orderID) {
        throw new Error("No order ID from PayPal");
      }

      // 2. Call Backend to Capture the Payment
      const captureResponse = await api.post('/payment/capture-paypal-order', {
        orderId: data.orderID,
      });

      // 3. Check if payment was successful
      if (captureResponse.status === 200 && captureResponse.data?.status === 'success') {
        console.log("Payment captured successfully");
        
        // 4. Save the Booking
        try {
          const bookingRequest = {
              userId: user.id, 
              eventId: parseInt(eventId),
              ticketTypeId: parseInt(selectedTicketId),
              paymentId: data.orderID // Save the PayPal Transaction ID
          };
          
          const bookingRes = await api.post('/bookings', bookingRequest);
          
          setMessage(`✓ Booking Successful! Booking ID: ${bookingRes.data.bookingId}`);
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate('/dashboard'); 
          }, 3000);
        } catch (bookingErr) {
          console.error("Booking Error:", bookingErr);
          setMessage("✓ Payment successful! Your booking is being processed. Redirecting...");
          setTimeout(() => {
            navigate('/dashboard'); 
          }, 3000);
        }
      } else {
        const errorMsg = captureResponse.data?.error || "Payment not completed";
        throw new Error(errorMsg);
      }

    } catch (err) {
      console.error("Payment Error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Payment processing failed. Please contact support.";
      setMessage("❌ " + errorMsg);
    }
  };

  // --- PAYPAL: On Error Function ---
  const onError = (err) => {
    console.error("PayPal Error:", err);
    setMessage("❌ Payment failed or cancelled. Please try again.");
  };


  if (loading) {
    return <div className="event-detail-container"><h1>Loading Event...</h1></div>;
  }

  if (error) {
    return <div className="event-detail-container"><h1>{error}</h1></div>;
  }

  if (!event) {
    return <div className="event-detail-container"><h1>Event not found.</h1></div>;
  }

  return (
    <div className="event-detail-container">
        
      <div className="event-detail-header">
        <img 
          src={event.imageUrls && event.imageUrls.length > 0 
            ? (event.imageUrls[0].startsWith("http")
                ? event.imageUrls[0]
                : `http://localhost:8081${event.imageUrls[0]}`)
            : 'https://placehold.co/1200x400/0f0f23/FF00FF?text=Evently'} 
          alt={event.eventName} 
          className="event-detail-banner"
        />
        <div className="event-detail-header-overlay">
          <h1>{event.eventName}</h1>
          <p className="event-detail-date">{new Date(event.eventDate).toLocaleString()}</p>
        </div>
      </div>

      <div className="event-detail-content">
        <div className="event-detail-main">
          <h2>About this Event</h2>
          <p>{event.description || "No description provided."}</p>
          
          <h2>Location</h2>
          <p>{event.location || "Location not specified."}</p>

          <h2>Theme</h2>
          <p>{event.theme || "Theme not specified."}</p>

          <h2>Rules & Regulations</h2>
          <p>{event.rulesAndRegulations || "No rules provided."}</p>
        </div>

        <div className="event-detail-sidebar">
          <div className="ticket-box">
            <h2>Book Your Ticket</h2>
            {message && <p className="message">{message}</p>}
            
            <div className="ticket-list">
              {tickets.length > 0 ? tickets.map(ticket => (
                <label key={ticket.id} className="ticket-option">
                  <input 
                    type="radio" 
                    name="ticket" 
                    value={ticket.id}
                    onChange={(e) => setSelectedTicketId(e.target.value)}
                  />
                  <div className="ticket-info">
                    <span className="ticket-name">{ticket.name}</span>
                    <span className="ticket-price">RS {ticket.price}</span>
                  </div>
                  <span className="ticket-desc">{ticket.description}</span>
                  <span className="ticket-qty">{ticket.quantityAvailable} available</span>
                </label>
              )) : (
                <p>This event is free or tickets are not yet available.</p>
              )}
            </div>
            
            {/* --- PAYPAL BUTTON LOGIC --- */}
            {tickets.length > 0 && selectedTicketId ? (
               <div style={{ marginTop: '25px', position: 'relative', zIndex: 1 }}>
                 <PayPalButtons 
                    style={{ layout: "vertical", color: "blue", shape: "pill", label: "pay" }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                 />
               </div>
            ) : tickets.length > 0 ? (
                // Show dummy button if no ticket selected
                <button 
                    className="book-now-button" 
                    onClick={() => setMessage('Please select a ticket type first.')}
                >
                    Select a Ticket to Pay
                </button>
            ) : null}

          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;