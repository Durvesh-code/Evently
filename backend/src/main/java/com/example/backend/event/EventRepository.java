package com.example.backend.event;

import com.example.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> { // Extends JpaRepository to get standard methods (save, findById, etc.)

    // Spring Data JPA automatically creates a query based on the method name.
    // This finds all Event entities associated with a specific User entity.
    List<Event> findByUser(User user); // This is line 12 - check it carefully
}