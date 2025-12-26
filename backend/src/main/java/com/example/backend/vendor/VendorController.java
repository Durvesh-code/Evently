package com.example.backend.vendor;

import com.example.backend.event.EventCategory;
import com.example.backend.event.EventCategoryRepository;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import com.example.backend.enquiry.EnquiryDTO;             // ✅ NEW IMPORT
import com.example.backend.enquiry.EnquiryRepository;     // ✅ NEW IMPORT
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendor")
public class VendorController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private EventCategoryRepository categoryRepository;

    @Autowired
    private EnquiryRepository enquiryRepository;  // ✅ NEWLY ADDED

    /**
     * GET /api/vendor/verification-data
     * Fetches all the data needed to populate the verification form (e.g., lists of services & categories)
     */
    @GetMapping("/verification-data")
    public ResponseEntity<Map<String, Object>> getVerificationData() {
        // 1. Get all available services
        List<ServiceDTO> services = serviceRepository.findAll().stream()
                .map(ServiceDTO::new)
                .collect(Collectors.toList());

        // 2. Get all available event categories
        List<EventCategory> categories = categoryRepository.findAll();

        // 3. Put them in a map and send to frontend
        Map<String, Object> response = new HashMap<>();
        response.put("services", services);
        response.put("categories", categories);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/vendor/verify
     * Submits the entire verification form
     */
    @PostMapping("/verify")
    @Transactional
    public ResponseEntity<String> submitVerification(
            @RequestBody VendorVerificationRequest request,
            Authentication authentication) {

        // 1. Get the logged-in user
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Find their corresponding vendor profile
        Vendor vendor = vendorRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found for user"));

        // 3. Find the related entities from the ID lists
        Set<Service> services = new HashSet<>(serviceRepository.findAllById(request.getServiceIds()));
        Set<EventCategory> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));

        // 4. Update the vendor's profile with all the new data
        vendor.setCompanyName(request.getCompanyName());
        vendor.setBusinessRegNo(request.getBusinessRegNo());
        vendor.setAddress(request.getAddress());
        vendor.setServiceArea(request.getServiceArea());
        vendor.setAbout(request.getAbout());
        vendor.setServices(services);
        vendor.setEventCategories(categories);
        vendor.setVerified(true); // Mark as verified or pending review

        // 5. Clear old portfolio and add new images
        Set<VendorPortfolioImage> portfolioImages = vendor.getPortfolioImages();
        portfolioImages.clear();

        if (request.getPortfolioImageUrls() != null) {
            for (String imageUrl : request.getPortfolioImageUrls()) {
                VendorPortfolioImage image = new VendorPortfolioImage();
                image.setImageUrl(imageUrl);
                image.setVendor(vendor);
                portfolioImages.add(image);
            }
        }

        // CascadeType.ALL on Vendor will handle saving new images
        vendorRepository.save(vendor);

        return ResponseEntity.ok("Verification details submitted successfully!");
    }

    /**
     * GET /api/vendor/my-enquiries
     * Fetches all enquiries received for the logged-in vendor.
     */
    @GetMapping("/my-enquiries")
    @Transactional(readOnly = true)
    public ResponseEntity<List<EnquiryDTO>> getMyEnquiries(Authentication authentication) {
        // 1. Get the logged-in user
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Find their corresponding vendor profile
        Vendor vendor = vendorRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found for user"));

        // 3. Find all enquiries for this vendor, newest first
        List<EnquiryDTO> enquiries = enquiryRepository.findByVendorIdOrderBySubmittedAtDesc(vendor.getId())
                .stream()
                .map(EnquiryDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(enquiries);
    }
}
