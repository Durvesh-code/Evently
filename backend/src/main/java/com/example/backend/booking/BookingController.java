package com.example.backend.booking;

import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository; // To find user by email

    // POST /api/bookings
    // Creates a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            // We should verify that the user in the request is the one who is logged in
            // This is a more secure way to get the user
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User currentUser = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Compare the logged-in user's ID with the request's user ID
            if (!currentUser.getId().equals(request.getUserId())) {
                return ResponseEntity.status(403).body("User ID mismatch");
            }

            Booking newBooking = bookingService.createBooking(request);
            return ResponseEntity.ok(new BookingResponse(newBooking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/bookings/my-bookings
    // Gets all bookings for the currently logged-in user
    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings() {
        try {
            // Get the logged-in user
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User currentUser = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<BookingResponse> bookings = bookingService.getBookingsForUser(currentUser.getId());
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}