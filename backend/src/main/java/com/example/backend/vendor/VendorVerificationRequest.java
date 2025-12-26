package com.example.backend.vendor;

import java.util.List;

// This DTO holds all the data from the frontend verification form
public class VendorVerificationRequest {

    private String companyName;
    private String businessRegNo;
    private String address;
    private String serviceArea;
    private String about;

    // These will be lists of IDs
    private List<Long> serviceIds;
    private List<Long> categoryIds;

    // This will be a list of image URLs from the storage service
    private List<String> portfolioImageUrls;

    // --- Getters ---
    public String getCompanyName() { return companyName; }
    public String getBusinessRegNo() { return businessRegNo; }
    public String getAddress() { return address; }
    public String getServiceArea() { return serviceArea; }
    public String getAbout() { return about; }
    public List<Long> getServiceIds() { return serviceIds; }
    public List<Long> getCategoryIds() { return categoryIds; }
    public List<String> getPortfolioImageUrls() { return portfolioImageUrls; }
}