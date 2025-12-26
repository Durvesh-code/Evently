package com.example.backend.booking;

import com.example.backend.event.Event;
import com.example.backend.event.EventRepository;
import com.example.backend.event.EventTicketType;
import com.example.backend.event.EventTicketTypeRepository;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private EventTicketTypeRepository ticketTypeRepository;

    @Transactional // This ensures the whole method succeeds or fails together
    public Booking createBooking(BookingRequest request) {

        // 1. Find all the related entities
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventTicketType ticketType = ticketTypeRepository.findById(request.getTicketTypeId())
                .orElseThrow(() -> new RuntimeException("Ticket type not found"));

        // 2. Check if tickets are available
        if (ticketType.getQuantityAvailable() <= 0) {
            throw new RuntimeException("No more tickets available for this type");
        }

        // 3. Decrement the ticket quantity
        ticketType.setQuantityAvailable(ticketType.getQuantityAvailable() - 1);
        ticketTypeRepository.save(ticketType);

        // 4. Create and save the new booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setTicketType(ticketType);
        booking.setBookingDate(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // Get all bookings for a specific user
    public List<BookingResponse> getBookingsForUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        return bookingRepository.findByUserId(userId)
                .stream()
                .map(BookingResponse::new) // Convert each Booking to a BookingResponse
                .collect(Collectors.toList());
    }
}