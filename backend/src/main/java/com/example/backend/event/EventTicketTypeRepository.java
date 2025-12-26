package com.example.backend.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventTicketTypeRepository extends JpaRepository<EventTicketType, Long> {

    // Finds all tickets for a specific event
    List<EventTicketType> findByEventId(Long eventId);
}