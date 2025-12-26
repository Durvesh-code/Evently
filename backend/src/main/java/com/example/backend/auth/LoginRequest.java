package com.example.backend.auth;

// This is a simple class (a "DTO") just to hold
// the email and password from the login form.
public class LoginRequest {

    private String email;
    private String password;

    // --- Getters and Setters ---

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}