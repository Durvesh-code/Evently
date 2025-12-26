package com.example.backend.payment;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

// Import for JSON handling
import org.json.JSONObject;

import java.util.Base64;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    // Use Sandbox API for testing
    private final String PAYPAL_SANDBOX_API = "https://api-m.sandbox.paypal.com";
    private final RestTemplate restTemplate = new RestTemplate();

    // 1. Helper method to get the Access Token from PayPal
    private String getAccessToken() throws Exception {
        if (clientId == null || clientId.isEmpty() || clientSecret == null || clientSecret.isEmpty()) {
            throw new RuntimeException("PayPal credentials are not configured properly in application.properties");
        }

        String authString = clientId + ":" + clientSecret;
        String base64Auth = Base64.getEncoder().encodeToString(authString.getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(base64Auth);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "grant_type=client_credentials";
        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(
                    PAYPAL_SANDBOX_API + "/v1/oauth2/token",
                    request,
                    (Class<Map<String, Object>>) (Class<?>) Map.class
            );
            
            if (response.getBody() == null || !response.getBody().containsKey("access_token")) {
                throw new RuntimeException("No access token in PayPal response");
            }
            
            return (String) response.getBody().get("access_token");
        } catch (RestClientException e) {
            System.err.println("PayPal Authentication Error: " + e.getMessage());
            throw new RuntimeException("Could not authenticate with PayPal: " + e.getMessage());
        }
    }

    // 2. Endpoint to create the PayPal Order
    @PostMapping("/create-paypal-order")
    public ResponseEntity<?> createPayPalOrder(@RequestBody Map<String, Object> data) {
        try {
            // Validate input
            if (data == null || data.get("amount") == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount is required"));
            }

            String accessToken = getAccessToken();
            double amount = Double.parseDouble(data.get("amount").toString());

            if (amount <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Amount must be greater than 0"));
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            // PayPal Order Creation Payload
            // NOTE: Currency must be USD for Sandbox accounts to work reliably without extra configuration
            JSONObject payload = new JSONObject()
                    .put("intent", "CAPTURE")
                    .put("purchase_units", new JSONObject[] {
                            new JSONObject().put("amount", new JSONObject()
                                    .put("currency_code", "USD")
                                    .put("value", String.format("%.2f", amount)))
                    })
                    .put("application_context", new JSONObject()
                            .put("brand_name", "Evently App")
                            .put("return_url", "http://localhost:5173/events")
                            .put("cancel_url", "http://localhost:5173/events"));

            HttpEntity<String> request = new HttpEntity<>(payload.toString(), headers);

            ResponseEntity<PayPalOrderDTO> response = restTemplate.postForEntity(
                    PAYPAL_SANDBOX_API + "/v2/checkout/orders",
                    request,
                    PayPalOrderDTO.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return ResponseEntity.ok(response.getBody());
            } else {
                return ResponseEntity.status(500).body(Map.of("error", "Failed to create PayPal order"));
            }
        } catch (Exception e) {
            System.err.println("Create Order Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error creating order: " + e.getMessage()));
        }
    }

    // 3. Endpoint to capture the funds after frontend approval
    @PostMapping("/capture-paypal-order")
    public ResponseEntity<?> capturePayPalOrder(@RequestBody Map<String, String> data) {
        try {
            // Validate input
            if (data == null || data.get("orderId") == null || data.get("orderId").isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Order ID is required"));
            }

            String accessToken = getAccessToken();
            String orderId = data.get("orderId");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            HttpEntity<String> request = new HttpEntity<>("{}", headers); // Empty body for capture request

            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(
                    PAYPAL_SANDBOX_API + "/v2/checkout/orders/" + orderId + "/capture",
                    request,
                    (Class<Map<String, Object>>) (Class<?>) Map.class
            );

            if (response.getBody() == null) {
                return ResponseEntity.status(500).body(Map.of("error", "No response from PayPal"));
            }

            String status = (String) response.getBody().get("status");

            if ("COMPLETED".equals(status)) {
                return ResponseEntity.ok(Map.of("status", "success", "message", "Payment Captured Successfully!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Payment not completed. Status: " + status));
            }
        } catch (Exception e) {
            System.err.println("Capture Payment Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error capturing payment: " + e.getMessage()));
        }
    }
}