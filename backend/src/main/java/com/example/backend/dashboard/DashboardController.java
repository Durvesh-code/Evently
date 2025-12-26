package com.example.backend.dashboard;

import com.example.backend.event.EventRepository;
import com.example.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    // We will inject the Ticket/Booking repository here later

    @GetMapping("/totals")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {

        long userCount = userRepository.count();
        long eventCount = eventRepository.count();

        DashboardStatsDTO stats = new DashboardStatsDTO(userCount, eventCount);
        return ResponseEntity.ok(stats);
    }
}