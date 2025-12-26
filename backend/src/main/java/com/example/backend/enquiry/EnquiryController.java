package com.example.backend.enquiry;

import com.example.backend.vendor.Vendor;
import com.example.backend.vendor.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    @Autowired
    private EnquiryRepository enquiryRepository;

    @Autowired
    private VendorRepository vendorRepository;

    /**
     * POST /api/enquiries
     * Create a new enquiry for a vendor
     */
    @PostMapping
    public ResponseEntity<?> createEnquiry(@RequestBody EnquiryRequestDTO requestDTO) {
        try {
            // Validate vendorId
            if (requestDTO.getVendorId() == null || requestDTO.getVendorId() <= 0) {
                return ResponseEntity.badRequest().body("Invalid vendor ID");
            }

            // Validate required fields
            if (requestDTO.getCustomerName() == null || requestDTO.getCustomerName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Customer name is required");
            }
            if (requestDTO.getCustomerEmail() == null || requestDTO.getCustomerEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Customer email is required");
            }
            if (requestDTO.getMessage() == null || requestDTO.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Message is required");
            }

            // Find the vendor
            Optional<Vendor> vendorOptional = vendorRepository.findById(requestDTO.getVendorId());
            if (vendorOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Vendor not found");
            }

            Vendor vendor = vendorOptional.get();

            // Create and populate the enquiry entity
            Enquiry enquiry = new Enquiry();
            enquiry.setVendor(vendor);
            enquiry.setCustomerName(requestDTO.getCustomerName().trim());
            enquiry.setCustomerEmail(requestDTO.getCustomerEmail().trim());
            enquiry.setCustomerPhone(requestDTO.getCustomerPhone());
            enquiry.setEventDate(requestDTO.getEventDate());
            enquiry.setMessage(requestDTO.getMessage().trim());

            // Save the enquiry
            enquiryRepository.save(enquiry);

            return ResponseEntity.ok("Enquiry sent successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send enquiry: " + e.getMessage());
        }
    }

    /**
     * GET /api/enquiries/{vendorId}
     * Get all enquiries for a specific vendor
     */
    @GetMapping("/{vendorId}")
    public ResponseEntity<?> getEnquiriesForVendor(@PathVariable Long vendorId) {
        try {
            List<Enquiry> enquiries = enquiryRepository.findByVendorIdOrderBySubmittedAtDesc(vendorId);
            return ResponseEntity.ok(enquiries);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch enquiries: " + e.getMessage());
        }
    }
}
