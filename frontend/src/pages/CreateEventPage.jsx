import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Use our api instance
import { AuthContext } from '../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import './CreateEventPage.css';

function CreateEventPage() {
  const [step, setStep] = useState(1);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- All Form Data State ---
  const [eventName, setEventName] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [theme, setTheme] = useState('');
  const [budget, setBudget] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // --- NEW State for Step 5 ---
  const [createdEventId, setCreatedEventId] = useState(null); // To store the ID of the new event
  const [isPaidEvent, setIsPaidEvent] = useState(false); // Your "Free/Paid" toggle
  const [createdTickets, setCreatedTickets] = useState([]); // List of tickets (Platinum, Gold)
  
  // State for the *new ticket* form
  const [ticketName, setTicketName] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState('');


  // --- Fetch Categories on Page Load (Same as before) ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // --- Fetch Category Template (Same as before) ---
  const handleCategoryChange = async (e) => {
    const newCategoryId = e.target.value;
    setCategoryId(newCategoryId);
    if (newCategoryId) {
      try {
        const response = await api.get(`/categories/${newCategoryId}`);
        setDescription(response.data.description || '');
        setRules(response.data.rulesAndRegulations || '');
      } catch (error) {
        console.error("Failed to fetch category details", error);
      }
    }
  };

  // --- Image Upload Logic (Same as before) ---
  const onDrop = async (acceptedFiles) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedImageUrls((prevUrls) => [...prevUrls, response.data.url]);
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    multiple: false,
  });

  const removeImage = (urlToRemove) => {
    setUploadedImageUrls((prevUrls) => prevUrls.filter(url => url !== urlToRemove));
  };


  // --- Navigation Logic ---
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  
  // --- *** UPDATED SUBMIT LOGIC *** ---
  // This is no longer the final submit, it's just for Step 4
  const handleSaveAndContinue = async () => {
    if (uploadedImageUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    // Collect all data from steps 1-4
    const eventData = {
      userId: user.id,
      eventName,
      categoryId: parseInt(categoryId),
      description,
      rulesAndRegulations: rules,
      eventDate: eventDate + ":00",
      location,
      theme,
      budget: parseFloat(budget),
      guestCount: parseInt(guestCount),
      imageUrls: uploadedImageUrls,
      isPaidEvent: isPaidEvent, // Send the free/paid status
    };

    try {
      // 1. Create the "draft" event
      // The backend will now return the new event object
      const response = await api.post('/events/create', eventData);
      
      // 2. Save the new event's ID
      setCreatedEventId(response.data.id);
      
      // 3. Move to the final step
      nextStep();
    } catch (error) {
      console.error("Failed to create event draft", error);
      alert("Failed to create event. Please check the console.");
    }
  };

  // --- *** NEW TICKET LOGIC for Step 5 *** ---
  const handleAddTicket = async (e) => {
    e.preventDefault();
    if (!createdEventId) {
      alert("No event ID found. Please go back.");
      return;
    }

    const newTicketData = {
      name: ticketName,
      price: parseFloat(ticketPrice),
      description: ticketDesc,
      quantityAvailable: parseInt(ticketQuantity),
    };

    try {
      // Call the new API endpoint we created
      const response = await api.post(`/events/${createdEventId}/tickets`, newTicketData);
      
      // Add the new ticket to our list to display it
      setCreatedTickets([...createdTickets, response.data]);
      
      // Clear the form
      setTicketName('');
      setTicketPrice('');
      setTicketDesc('');
      setTicketQuantity('');

    } catch (error) {
      console.error("Failed to add ticket", error);
      alert("Failed to add ticket. Please check the console.");
    }
  };
  
  // This is the final "Finish" button
  const handleFinishCreation = () => {
    alert("Event Created Successfully!");
    navigate('/admin'); // Redirect to Admin Dashboard
  };


  // --- Render Logic ---
  const renderStep = () => {
    switch (step) {
      case 1: // Basic Details
        return (
          <div>
            <div className="form-group">
              <label>Event Name</label>
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Event Category</label>
              <select value={categoryId} onChange={handleCategoryChange}>
                <option value="" disabled>Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 2: // Description & Rules
        return (
          <div>
            <div className="form-group">
              <label>Event Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Rules & Regulations</label>
              <textarea value={rules} onChange={(e) => setRules(e.target.value)} />
            </div>
          </div>
        );
      case 3: // Event Specifics
        return (
          <div>
            <div className="form-group"><label>Event Date and Time</label><input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} /></div>
            <div className="form-group"><label>Location</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
            <div className="form-group"><label>Theme</label><input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} /></div>
            <div className="form-group"><label>Budget (Rs)</label><input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} /></div>
            <div className="form-group"><label>Guest Count</label><input type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} /></div>
          </div>
        );
      case 4: // Image Upload
        return (
          <div>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              {isUploading ? <p>Uploading...</p> : <p>Drag 'n' drop images here</p>}
            </div>
            <div className="image-preview-container">
              {uploadedImageUrls.map((url, index) => (
                <div key={index} className="image-preview">
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button className="remove-image-button" onClick={() => removeImage(url)}>X</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 5: // *** NEW STEP: Tickets & Pricing ***
        return (
          <div>
            <div className="pricing-toggle">
              <label>
                <input 
                  type="radio" 
                  name="pricing" 
                  checked={!isPaidEvent} 
                  onChange={() => setIsPaidEvent(false)}
                />
                Free Event
              </label>
              <label>
                <input 
                  type="radio" 
                  name="pricing" 
                  checked={isPaidEvent} 
                  onChange={() => setIsPaidEvent(true)}
                />
                Paid Event
              </label>
            </div>

            {/* Only show the ticket form if it's a "Paid Event" */}
            {isPaidEvent && (
              <form className="add-ticket-form" onSubmit={handleAddTicket}>
                <h3>Add a Ticket Type</h3>
                <div className="form-group">
                  <label>Ticket Name</label>
                  <input type="text" value={ticketName} onChange={(e) => setTicketName(e.target.value)} placeholder="e.g., Platinum, General Admission" required />
                </div>
                <div className="form-group">
                  <label>Price (RS)</label>
                  <input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} placeholder="e.g., 50.00" required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input type="text" value={ticketDesc} onChange={(e) => setTicketDesc(e.target.value)} placeholder="e.g., Front row access" />
                </div>
                <div className="form-group">
                  <label>Quantity Available</label>
                  <input type="number" value={ticketQuantity} onChange={(e) => setTicketQuantity(e.target.value)} placeholder="e.g., 100" required />
                </div>
                <button type="submit" className="step-nav-button next">Add Ticket</button>
              </form>
            )}

            {/* Show the list of tickets added so far */}
            <h3 className="ticket-list-header">Added Tickets</h3>
            {createdTickets.length === 0 ? (
              <p>No ticket types added yet.</p>
            ) : (
              <ul className="ticket-list">
                {createdTickets.map(ticket => (
                  <li key={ticket.id} className="ticket-list-item">
                    <div>
                      <span className="info">{ticket.name}</span>
                      <span className="price"> - ${ticket.price}</span>
                      <span className="quantity"> ({ticket.quantityAvailable} available)</span>
                    </div>
                    <div className="actions">
                      <button>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>
      <div className="step-indicator">Step {step} of 5</div>
      
      <div className="step-content">
        {renderStep()}
      </div>

      <div className="step-navigation">
        <button className="step-nav-button" onClick={prevStep} disabled={step === 1}>
          Previous
        </button>
        
        {step === 5 ? (
          <button className="step-nav-button next" onClick={handleFinishCreation}>
            Finish & Publish Event
          </button>
        ) : step === 4 ? (
          <button className="step-nav-button next" onClick={handleSaveAndContinue}>
            Save & Add Pricing
          </button>
        ) : (
          <button className="step-nav-button next" onClick={nextStep} disabled={!categoryId || !eventName}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateEventPage;