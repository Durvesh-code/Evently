package com.example.backend.auth;

// This DTO holds all fields from the vendor registration form
public class VendorRegistrationRequest {

    // User fields
    private String username;
    private String email;
    private String password;

    // --- REMOVED Vendor fields ---

    // --- Getters for all fields ---

    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
}