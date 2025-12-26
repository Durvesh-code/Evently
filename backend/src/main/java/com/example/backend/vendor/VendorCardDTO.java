package com.example.backend.vendor;

import java.util.List;
import java.util.stream.Collectors;

// This DTO is for the public "Vendor List" card
public class VendorCardDTO {

    private Long id;
    private String companyName;
    private String about;
    private List<String> portfolioImageUrls;

    public VendorCardDTO(Vendor vendor) {
        this.id = vendor.getId();
        this.companyName = vendor.getCompanyName();
        this.about = vendor.getAbout();

        if (vendor.getPortfolioImages() != null) {
            this.portfolioImageUrls = vendor.getPortfolioImages().stream()
                    .map(VendorPortfolioImage::getImageUrl)
                    .collect(Collectors.toList());
        }
    }

    // --- Generate Getters for all fields ---
    public Long getId() { return id; }
    public String getCompanyName() { return companyName; }
    public String getAbout() { return about; }
    public List<String> getPortfolioImageUrls() { return portfolioImageUrls; }
}