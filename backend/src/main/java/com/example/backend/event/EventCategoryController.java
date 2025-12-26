package com.example.backend.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional; // 1. ADD THIS IMPORT

@RestController
@RequestMapping("/api/categories")
public class EventCategoryController {

    @Autowired
    private EventCategoryRepository categoryRepository;

    // This endpoint gets all categories for the dropdown menu
    @GetMapping
    public List<EventCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    // --- 2. ADD THIS NEW METHOD ---
    // This endpoint gets a SINGLE category by its ID (for the template)
    @GetMapping("/{id}")
    public ResponseEntity<EventCategory> getCategoryById(@PathVariable Long id) {
        Optional<EventCategory> category = categoryRepository.findById(id);

        // Find the category and send it, or send a 404 "Not Found" error
        return category.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // This endpoint allows an admin to create a new category
    @PostMapping
    public ResponseEntity<EventCategory> createCategory(@RequestBody EventCategory category) {
        EventCategory savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(savedCategory);
    }

    // (We will add PUT and DELETE here later when we build the admin page)
}