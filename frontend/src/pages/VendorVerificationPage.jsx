import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import './VendorVerificationPage.css';

function VendorVerificationPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // === State for Form Fields ===
  const [formData, setFormData] = useState({
    companyName: '',
    businessRegNo: '',
    address: '',
    serviceArea: '',
    about: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // === State for Dynamic Data ===
  const [availableServices, setAvailableServices] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  
  // === State for Checkboxes and Images ===
  const [selectedServiceIds, setSelectedServiceIds] = useState(new Set());
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(new Set());
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);


  // --- 1. Fetch Form Data (Services & Categories) on Load ---
  useEffect(() => {
    // Only fetch data if the user exists and is NOT verified
    if (user && !user.isVerified) {
      const fetchVerificationData = async () => {
        try {
          setLoading(true);
          const response = await api.get('/vendor/verification-data');
          setAvailableServices(response.data.services || []);
          setAvailableCategories(response.data.categories || []);
        } catch (error) {
          console.error("Failed to fetch verification data", error);
          setMessage("Error: Could not load form data.");
        } finally {
          setLoading(false);
        }
      };
      fetchVerificationData();
    } else {
      // If user is verified or doesn't exist, we aren't loading anything
      setLoading(false);
    }
  }, [user]); // Rerun if user changes

  // --- 2. Handle Text Input Changes ---
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- 3. Handle Checkbox Toggling ---
  const handleCheckboxToggle = (id, stateSetter) => {
    stateSetter((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // --- 4. Image Upload Logic ---
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
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
  });

  const removeImage = (urlToRemove) => {
    setUploadedImageUrls((prevUrls) => prevUrls.filter(url => url !== urlToRemove));
  };


  // --- 5. Handle Final Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (selectedServiceIds.size === 0 || selectedCategoryIds.size === 0) {
      setMessage("Please select at least one service and one event category.");
      return;
    }

    const verificationData = {
      ...formData,
      serviceIds: Array.from(selectedServiceIds),
      categoryIds: Array.from(selectedCategoryIds),
      portfolioImageUrls: uploadedImageUrls,
    };

    try {
      const response = await api.post('/vendor/verify', verificationData);
      
      setMessage(response.data);
      alert("Verification Submitted Successfully! Please log in again to see your updated status.");
      
      navigate('/vendor/dashboard');

    } catch (error) {
      console.error("Verification submission failed", error);
      setMessage(error.response?.data || "Submission failed. Please try again.");
    }
  };


  // --- 6. RENDER LOGIC ---

  if (loading) {
    return (
      <div className="verification-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  // --- THIS IS THE NEW LOGIC FOR VERIFIED VENDORS ---
  if (user && user.isVerified) {
    return (
      <div className="verification-container">
        <h2>You are Already Verified</h2>
        <p>Your vendor profile is active and visible to event organizers.</p>
      </div>
    );
  }
  
  // --- This is the form for UNVERIFIED vendors ---
  return (
    <div className="verification-container">
      <form onSubmit={handleSubmit}>
        <h2>Get Verified</h2>
        <p>Complete your professional profile to start receiving enquiries.</p>
        
        {message && <p className="message">{message}</p>}

        {/* --- Section 1: Business Identity --- */}
        <h3>Business & Legal Identity</h3>
        <div className="form-group">
          <label>Company Name</label>
          <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Business Registration Number (GSTIN, etc.)</label>
          <input type="text" name="businessRegNo" value={formData.businessRegNo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Business Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        {/* --- Section 2: Services & Specialization --- */}
        <h3>Services & Specialization</h3>
        <div className="form-group">
          <label>Service Area (e.g., "Mumbai, Pune, Nashik")</label>
          <input type="text" name="serviceArea" value={formData.serviceArea} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>About My Business</label>
          <textarea name="about" value={formData.about} onChange={handleChange} placeholder="Describe your company, services, and experience..." required />
        </div>
        
        <div className="form-group checkbox-group">
          <label>Event Types I Service</label>
          <div className="checkbox-grid">
            {availableCategories.map(cat => (
              <label key={cat.id} className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={selectedCategoryIds.has(cat.id)}
                  onChange={() => handleCheckboxToggle(cat.id, setSelectedCategoryIds)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="form-group checkbox-group">
          <label>Services I Provide</label>
          <div className="checkbox-grid">
            {availableServices.map(srv => (
              <label key={srv.id} className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={selectedServiceIds.has(srv.id)}
                  onChange={() => handleCheckboxToggle(srv.id, setSelectedServiceIds)}
                />
                <span>{srv.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* --- Section 3: Portfolio --- */}
        <h3>Portfolio Gallery</h3>
        <div className="form-group">
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {isUploading ? <p>Uploading...</p> : <p>Drag 'n' drop portfolio images here</p>}
          </div>
          <div className="image-preview-container">
            {uploadedImageUrls.map((url, index) => (
              <div key={index} className="image-preview">
                <img src={url} alt={`Portfolio preview ${index + 1}`} />
                <button type="button" className="remove-image-button" onClick={() => removeImage(url)}>X</button>
              </div>
            ))}
          </div>
        </div>

        {/* --- Submission Button --- */}
        <button type="submit" className="submit-button">
          Submit for Verification
        </button>
      </form>
    </div>
  );
}

export default VendorVerificationPage;