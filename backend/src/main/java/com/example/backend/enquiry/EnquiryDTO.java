package com.example.backend.enquiry;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EnquiryDTO {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private LocalDate eventDate;
    private String message;
    private LocalDateTime submittedAt;

    public EnquiryDTO(Enquiry enquiry) {
        this.id = enquiry.getId();
        this.customerName = enquiry.getCustomerName();
        this.customerEmail = enquiry.getCustomerEmail();
        this.customerPhone = enquiry.getCustomerPhone();
        this.eventDate = enquiry.getEventDate();
        this.message = enquiry.getMessage();
        this.submittedAt = enquiry.getSubmittedAt();
    }

    // --- Generate Getters for all fields ---
    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public String getCustomerPhone() { return customerPhone; }
    public LocalDate getEventDate() { return eventDate; }
    public String getMessage() { return message; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
}