package com.example.backend.vendor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorPortfolioImageRepository extends JpaRepository<VendorPortfolioImage, Long> {
}