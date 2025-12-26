package com.example.backend.event;

import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // Import this

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventCategoryRepository categoryRepository;

    @Autowired
    private EventImageRepository imageRepository;

    @PostMapping("/create")
    // 1. CHANGE THE RETURN TYPE from <String> to <EventDetailsDTO>
    public ResponseEntity<EventDetailsDTO> createEvent(@RequestBody CreateEventRequest request) {

        // 1. Find the user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // 2. Find the category
        EventCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found!"));

        // 3. Create a new Event entity
        Event event = new Event();
        event.setEventName(request.getEventName());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setTheme(request.getTheme());
        event.setBudget(request.getBudget());
        event.setGuestCount(request.getGuestCount());

        // 4. Add the new fields
        event.setDescription(request.getDescription());
        event.setRulesAndRegulations(request.getRulesAndRegulations());
        event.setIsPaidEvent(request.getIsPaidEvent()); // Set the free/paid status

        // 5. Link the event to the user and category
        event.setUser(user);
        event.setCategory(category);

        // 6. Save the event *first* to get its ID
        Event savedEvent = eventRepository.save(event);

        // 7. Create and save all the EventImage objects
        Set<EventImage> images = new HashSet<>();
        if (request.getImageUrls() != null) {
            for (String imageUrl : request.getImageUrls()) {
                EventImage eventImage = new EventImage();
                eventImage.setImageUrl(imageUrl);
                eventImage.setEvent(savedEvent); // Link the image to the event
                images.add(eventImage);
            }
            imageRepository.saveAll(images); // Save all images
        }

        // 8. Update the event with the image links
        savedEvent.setImages(images);
        eventRepository.save(savedEvent);

        // 9. RETURN THE NEW EVENT DTO (This is the fix)
        // This sends the full object back, including the ID
        return ResponseEntity.ok(new EventDetailsDTO(savedEvent));
    }

    // This is your existing method to get all events
    @GetMapping
    public ResponseEntity<List<EventDetailsDTO>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        List<EventDetailsDTO> eventDTOs = events.stream()
                .map(EventDetailsDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventDTOs);
    }

    // This is your existing method to get a single event
    @GetMapping("/{id}")
    public ResponseEntity<EventDetailsDTO> getEventById(@PathVariable Long id) {
        Optional<Event> eventOptional = eventRepository.findById(id);

        if (eventOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Event event = eventOptional.get();
        EventDetailsDTO eventDTO = new EventDetailsDTO(event);

        return ResponseEntity.ok(eventDTO);
    }

}