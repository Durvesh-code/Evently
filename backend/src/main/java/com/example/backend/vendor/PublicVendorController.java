package com.example.backend.vendor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PublicVendorController {

    @Autowired
    private VendorRepository vendorRepository;

    // ENDPOINT 1: Get all VERIFIED vendors
    @GetMapping("/vendors")
    public ResponseEntity<List<VendorCardDTO>> getAllVerifiedVendors() {
        // We must create VendorCardDTO and the repository method
        List<Vendor> vendors = vendorRepository.findAllByIsVerified(true);

        List<VendorCardDTO> dtos = vendors.stream()
                .map(VendorCardDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}