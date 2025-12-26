package com.example.backend.enquiry;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class EnquiryRequestDTO {
    private Long vendorId; // The ID of the vendor to send this to
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate eventDate;
    
    private String message;

    // --- Getters and Setters ---
    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}