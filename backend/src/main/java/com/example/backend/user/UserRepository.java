package com.example.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA will automatically create a query for this method
    // "SELECT * FROM users WHERE email = ?"
    Optional<User> findByEmail(String email);

    // "SELECT * FROM users WHERE username = ?"
    Optional<User> findByUsername(String username);
}