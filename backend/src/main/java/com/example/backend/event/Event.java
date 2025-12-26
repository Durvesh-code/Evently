package com.example.backend.event;

import com.example.backend.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventName;
    private LocalDateTime eventDate;
    private String location;
    private String theme;
    private BigDecimal budget;
    private int guestCount;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String rulesAndRegulations;

    // --- 1. ADD THIS NEW FIELD ---
    @Column(name = "is_paid_event") // Matches the DB column
    private Boolean isPaidEvent;

    // --- RELATIONSHIPS ---
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private EventCategory category;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EventImage> images;

    // --- 2. ADD THIS NEW RELATIONSHIP ---
    // One event can have many ticket types
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EventTicketType> ticketTypes;

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRulesAndRegulations() { return rulesAndRegulations; }
    public void setRulesAndRegulations(String rules) { this.rulesAndRegulations = rules; }

    // --- 3. ADD GETTER/SETTER FOR NEW FIELD ---
    public Boolean getIsPaidEvent() {
        return isPaidEvent;
    }

    public void setIsPaidEvent(Boolean isPaidEvent) {
        this.isPaidEvent = isPaidEvent;
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public EventCategory getCategory() { return category; }
    public void setCategory(EventCategory category) { this.category = category; }

    public Set<EventImage> getImages() { return images; }
    public void setImages(Set<EventImage> images) { this.images = images; }

    // --- 4. ADD GETTER/SETTER FOR NEW RELATIONSHIP ---
    public Set<EventTicketType> getTicketTypes() {
        return ticketTypes;
    }

    public void setTicketTypes(Set<EventTicketType> ticketTypes) {
        this.ticketTypes = ticketTypes;
    }
}