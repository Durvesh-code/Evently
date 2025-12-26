package com.example.backend.event;

import com.fasterxml.jackson.annotation.JsonIgnore; // 1. IMPORT THIS
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "event_categories")
public class EventCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // 2. ADD THIS NEW FIELD
    @Column(columnDefinition = "TEXT")
    private String rulesAndRegulations;

    // 3. ADD THIS ANNOTATION to fix the crash
    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private Set<Event> events;

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    // 4. ADD GETTER AND SETTER FOR NEW FIELD
    public String getRulesAndRegulations() {
        return rulesAndRegulations;
    }

    public void setRulesAndRegulations(String rulesAndRegulations) {
        this.rulesAndRegulations = rulesAndRegulations;
    }

    public Set<Event> getEvents() { return events; }
    public void setEvents(Set<Event> events) { this.events = events; }
}