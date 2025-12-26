package com.example.backend.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CreateEventRequest {

    private String eventName;
    private LocalDateTime eventDate;
    private String location;
    private String theme;
    private BigDecimal budget;
    private int guestCount;
    private Long userId;
    private Long categoryId;
    private List<String> imageUrls;

    // --- ADD THESE NEW FIELDS ---
    private String description;
    private String rulesAndRegulations;
    private Boolean isPaidEvent;
    // --- Getters and Setters ---

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public int getGuestCount() { return guestCount; }
    public void setGuestCount(int guestCount) { this.guestCount = guestCount; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public Boolean getIsPaidEvent() {
        return isPaidEvent;
    }
    public void setIsPaidEvent(Boolean isPaidEvent) {
        this.isPaidEvent = isPaidEvent;
    }
    // --- ADD GETTERS/SETTERS FOR NEW FIELDS ---

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRulesAndRegulations() {
        return rulesAndRegulations;
    }

    public void setRulesAndRegulations(String rulesAndRegulations) {
        this.rulesAndRegulations = rulesAndRegulations;
    }
}