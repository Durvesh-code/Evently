package com.example.backend.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// This class defines the "clean" booking data we send to the frontend
public class BookingResponse {

    private Long bookingId;
    private LocalDateTime bookingDate;
    private String eventName;
    private LocalDateTime eventDate;
    private String ticketName;
    private BigDecimal ticketPrice;

    public BookingResponse(Booking booking) {
        this.bookingId = booking.getId();
        this.bookingDate = booking.getBookingDate();
        this.eventName = booking.getEvent().getEventName();
        this.eventDate = booking.getEvent().getEventDate();
        this.ticketName = booking.getTicketType().getName();
        this.ticketPrice = booking.getTicketType().getPrice();
    }

    // --- Getters ---
    public Long getBookingId() { return bookingId; }
    public LocalDateTime getBookingDate() { return bookingDate; }
    public String getEventName() { return eventName; }
    public LocalDateTime getEventDate() { return eventDate; }
    public String getTicketName() { return ticketName; }
    public BigDecimal getTicketPrice() { return ticketPrice; }
}