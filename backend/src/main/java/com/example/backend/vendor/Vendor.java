package com.example.backend.vendor;

import com.example.backend.event.EventCategory; // 1. IMPORT
import com.example.backend.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Set; // 2. IMPORT
import java.util.HashSet; // <-- ADD THIS LINE

@Entity
@Table(name = "vendors")
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- 3. ADD NEW FIELDS ---
    @Column(name = "company_name")
    private String companyName;

    @Column(name = "business_reg_no")
    private String businessRegNo;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "service_area", columnDefinition = "TEXT")
    private String serviceArea;

    @Column(columnDefinition = "TEXT")
    private String about;

    @Column(name = "is_verified", columnDefinition = "boolean default false")
    private boolean isVerified = false;

    // --- (Existing user relationship) ---
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    // --- 4. ADD NEW RELATIONSHIPS ---

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "vendor_services",
            joinColumns = @JoinColumn(name = "vendor_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private Set<Service> services;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "vendor_event_categories",
            joinColumns = @JoinColumn(name = "vendor_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<EventCategory> eventCategories;

    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<VendorPortfolioImage> portfolioImages = new HashSet<>(); // <-- INITIALIZE HERE

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    // --- 5. ADD GETTERS/SETTERS FOR NEW FIELDS & RELATIONS ---

    public String getBusinessRegNo() { return businessRegNo; }
    public void setBusinessRegNo(String businessRegNo) { this.businessRegNo = businessRegNo; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getServiceArea() { return serviceArea; }
    public void setServiceArea(String serviceArea) { this.serviceArea = serviceArea; }
    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }
    public Set<Service> getServices() { return services; }
    public void setServices(Set<Service> services) { this.services = services; }
    public Set<EventCategory> getEventCategories() { return eventCategories; }
    public void setEventCategories(Set<EventCategory> eventCategories) { this.eventCategories = eventCategories; }
    public Set<VendorPortfolioImage> getPortfolioImages() { return portfolioImages; }
    public void setPortfolioImages(Set<VendorPortfolioImage> portfolioImages) { this.portfolioImages = portfolioImages; }
}