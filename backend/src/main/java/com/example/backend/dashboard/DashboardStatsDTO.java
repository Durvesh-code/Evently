package com.example.backend.dashboard;

// This is a DTO (Data Transfer Object)
// to hold the stats we send to the frontend
public class DashboardStatsDTO {

    private long totalUsers;
    private long totalEvents;

    public DashboardStatsDTO(long totalUsers, long totalEvents) {
        this.totalUsers = totalUsers;
        this.totalEvents = totalEvents;
    }

    // --- Getters ---
    public long getTotalUsers() {
        return totalUsers;
    }
    public long getTotalEvents() {
        return totalEvents;
    }
}