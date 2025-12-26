package com.example.backend.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events/{eventId}/tickets")
public class EventTicketController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventTicketTypeRepository ticketTypeRepository;

    // GET /api/events/{eventId}/tickets
    // Gets all tickets for one event
    @GetMapping
    public ResponseEntity<List<EventTicketTypeDTO>> getTicketsForEvent(@PathVariable Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            return ResponseEntity.notFound().build();
        }

        List<EventTicketType> tickets = ticketTypeRepository.findByEventId(eventId);
        List<EventTicketTypeDTO> dtos = tickets.stream()
                .map(EventTicketTypeDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // POST /api/events/{eventId}/tickets
    // Creates a new ticket type (Platinum, Gold) for an event
    @PostMapping
    public ResponseEntity<EventTicketTypeDTO> createTicket(@PathVariable Long eventId, @RequestBody EventTicketType ticketRequest) {

        // Find the event this ticket belongs to
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));

        // Link the ticket to the event
        ticketRequest.setEvent(event);

        // Save the new ticket
        EventTicketType savedTicket = ticketTypeRepository.save(ticketRequest);

        return ResponseEntity.ok(new EventTicketTypeDTO(savedTicket));
    }

    // TODO: We can add PUT (update) and DELETE endpoints here later
}