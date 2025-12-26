package com.example.backend.auth;

// This class defines the JSON object we will send back
// after a successful login, including the JWT token.
public class LoginResponse {

    private String message;
    private String username;
    private String role;
    private String email;
    private Long id;
    private String token; // The JWT token
    private Boolean isVerified; // <-- 1. ADD THIS FIELD

    // Constructor including all fields
    public LoginResponse(String message, String username, String role, String email, Long id, String token, Boolean isVerified) { // <-- 2. ADD TO CONSTRUCTOR
        this.message = message;
        this.username = username;
        this.role = role;
        this.email = email;
        this.id = id;
        this.token = token;
        this.isVerified = isVerified; // <-- 3. SET THE FIELD
    }

    // --- Getters and Setters for all fields ---

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Boolean getIsVerified() { return isVerified; } // <-- 4. ADD GETTER
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
}