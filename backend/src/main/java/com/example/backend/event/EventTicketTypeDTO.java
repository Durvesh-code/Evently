package com.example.backend.event;

import java.math.BigDecimal;

// This is a "clean" object to send ticket data to the frontend
public class EventTicketTypeDTO {

    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
    private int quantityAvailable;

    // Constructor to convert an Entity to a DTO
    public EventTicketTypeDTO(EventTicketType entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.price = entity.getPrice();
        this.description = entity.getDescription();
        this.quantityAvailable = entity.getQuantityAvailable();
    }

    // --- Getters ---

    public Long getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public String getDescription() { return description; }
    public int getQuantityAvailable() { return quantityAvailable; }
}