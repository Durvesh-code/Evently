package com.example.backend.enquiry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    // Finds all enquiries for a specific vendor, ordered by newest first
    List<Enquiry> findByVendorIdOrderBySubmittedAtDesc(Long vendorId);
}