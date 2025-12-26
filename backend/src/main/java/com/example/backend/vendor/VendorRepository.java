package com.example.backend.vendor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // 1. IMPORT
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByUserId(Long userId);

    // 2. ADD THIS METHOD
    // Finds all vendors that have isVerified = true
    List<Vendor> findAllByIsVerified(boolean isVerified);
}