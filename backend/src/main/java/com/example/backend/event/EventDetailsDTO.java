package com.example.backend.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

// This DTO shapes the event data we send to the frontend
public class EventDetailsDTO {

    private Long id;
    private String eventName;
    private LocalDateTime eventDate;
    private String location;
    private String theme;
    private BigDecimal budget;
    private int guestCount;

    private Boolean isPaidEvent;
    private List<EventTicketTypeDTO> ticketTypes;
    // --- New fields for our professional card ---
    private String categoryName;
    private List<String> imageUrls;
    private String createdByUsername; // Nice to show who made it

    // --- Constructor ---
    public EventDetailsDTO(Event event) {
        this.id = event.getId();
        this.eventName = event.getEventName();
        this.eventDate = event.getEventDate();
        this.location = event.getLocation();
        // (set other fields: theme, budget, guestCount, categoryName, createdByUsername...)

        // --- 3. SET THE NEW FIELDS ---
        this.isPaidEvent = event.getIsPaidEvent();

        if (event.getImages() != null) {
            this.imageUrls = event.getImages().stream()
                    .map(EventImage::getImageUrl)
                    .collect(Collectors.toList());
        }

        // Convert the Set of ticket entities to a List of ticket DTOs
        if (event.getTicketTypes() != null) {
            this.ticketTypes = event.getTicketTypes().stream()
                    .map(EventTicketTypeDTO::new) // Uses the DTO constructor
                    .collect(Collectors.toList());
        }
    }

    public Boolean getIsPaidEvent() { return isPaidEvent; }
    public List<EventTicketTypeDTO> getTicketTypes() { return ticketTypes; }

    // --- (All other getters remain the same) ---
    public Long getId() { return id; }
    public String getEventName() { return eventName; }
    public LocalDateTime getEventDate() { return eventDate; }
    public String getLocation() { return location; }
    public String getTheme() { return theme; }
    public BigDecimal getBudget() { return budget; }
    public int getGuestCount() { return guestCount; }
    public String getCategoryName() { return categoryName; }
    public List<String> getImageUrls() { return imageUrls; }
    public String getCreatedByUsername() { return createdByUsername; }
}