package com.example.backend.booking;

// This class holds the data from the user's booking request
public class BookingRequest {

    private Long userId;
    private Long eventId;
    private Long ticketTypeId;

    // --- Getters ---
    public Long getUserId() { return userId; }
    public Long getEventId() { return eventId; }
    public Long getTicketTypeId() { return ticketTypeId; }
}