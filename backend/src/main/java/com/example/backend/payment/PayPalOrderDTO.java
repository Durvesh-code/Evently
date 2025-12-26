package com.example.backend.payment;

public class PayPalOrderDTO {
    private String id;
    private String status;

    // Getters and Setters are required
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}