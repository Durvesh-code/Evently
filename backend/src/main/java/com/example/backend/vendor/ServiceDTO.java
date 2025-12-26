package com.example.backend.vendor;

// This DTO sends a "clean" Service object to the frontend
public class ServiceDTO {
    private Long id;
    private String name;

    public ServiceDTO(Service service) {
        this.id = service.getId();
        this.name = service.getName();
    }

    // --- Getters ---
    public Long getId() { return id; }
    public String getName() { return name; }
}