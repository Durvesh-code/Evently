package com.example.backend.chatbot;

import com.example.backend.event.Event;
import com.example.backend.event.EventRepository;
import com.example.backend.event.EventTicketType;
import com.example.backend.vendor.Vendor;
import com.example.backend.vendor.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Value("${app.openrouter.api-key}")
    private String apiKey;

    @Value("${app.openrouter.model}")
    private String modelName;

    @Value("${app.openrouter.url}")
    private String apiUrl;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private VendorRepository vendorRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getResponse(String userMessage) {
        // 1. Fetch Real Data from DB and format it with PRICES
        String eventData = eventRepository.findAll().stream()
                .map(e -> {
                    String priceInfo = "Free Entry";
                    Set<EventTicketType> tickets = e.getTicketTypes();

                    // --- FIX: Check tickets directly, ignore 'isPaidEvent' flag ---
                    if (tickets != null && !tickets.isEmpty()) {
                        // If tickets exist, format them (e.g., "Platinum: 5000, Gold: 3000")
                        priceInfo = tickets.stream()
                                .map(t -> t.getName() + ": Rs " + t.getPrice())
                                .collect(Collectors.joining(", "));
                    }
                    // -------------------------------------------------------------

                    return String.format("- Event: %s | Date: %s | Loc: %s | Tickets: [%s]",
                            e.getEventName(), e.getEventDate(), e.getLocation(), priceInfo);
                })
                .collect(Collectors.joining("\n"));

        String vendorData = vendorRepository.findAll().stream()
                .map(v -> String.format("- Vendor: %s | Service Area: %s | Verified: %s",
                        v.getCompanyName(), v.getServiceArea(), v.isVerified()))
                .collect(Collectors.joining("\n"));

        // 2. Define Workflow Knowledge
        String appWorkflow = """
                APP WORKFLOW:
                - Users must register/login to book tickets.
                - We use PayPal Sandbox for payments (USD/INR currency).
                - Admins approve vendors and see stats.
                - Vendors must verify their profile to get listed.
                - To book: Go to Event Page -> Select Ticket -> Click PayPal.
                """;

        // 3. Construct the System Prompt
        String systemPrompt = String.format("""
                You are the official AI Assistant for 'Evently', an event management platform.
                
                STRICT RULES:
                1. You MUST ONLY answer questions about Evently, our events, our vendors, or our app workflow.
                2. If the user asks about general topics (e.g., "Who is the president?", "Write code"), politely refuse.
                3. Use the REAL DATABASE DATA below. 
                4. If specific ticket prices are listed (e.g. "Platinum: Rs 5000"), tell the user those exact prices. Do NOT say it is free if prices are listed.
                
                %s
                
                REAL DATABASE DATA:
                Events List:
                %s
                
                Vendors List:
                %s
                """, appWorkflow, eventData, vendorData);

        // 4. Prepare Request
        List<OpenRouterRequest.Message> messages = new ArrayList<>();
        messages.add(new OpenRouterRequest.Message("system", systemPrompt));
        messages.add(new OpenRouterRequest.Message("user", userMessage));

        OpenRouterRequest request = new OpenRouterRequest(modelName, messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("HTTP-Referer", "http://localhost:5173");
        headers.add("X-Title", "Evently App");

        HttpEntity<OpenRouterRequest> entity = new HttpEntity<>(request, headers);

        // 5. Call API
        try {
            ResponseEntity<OpenRouterResponse> response = restTemplate.postForEntity(apiUrl, entity, OpenRouterResponse.class);
            if (response.getBody() != null && !response.getBody().getChoices().isEmpty()) {
                return response.getBody().getChoices().get(0).getMessage().getContent();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "I'm having trouble connecting to my brain (OpenRouter) right now.";
        }
        return "No response received.";
    }
}