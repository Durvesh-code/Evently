package com.example.backend.auth;

import com.example.backend.security.JwtUtil;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import com.example.backend.vendor.Vendor;
import com.example.backend.vendor.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    // --- 1. REGISTER USER (Was Missing) ---
    @PostMapping("/register/user")
    public ResponseEntity<String> registerUser(@RequestBody VendorRegistrationRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // --- 2. REGISTER ADMIN (Was Missing) ---
    @PostMapping("/register/admin")
    public ResponseEntity<String> registerAdmin(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("ROLE_ADMIN");

        userRepository.save(user);
        return ResponseEntity.ok("Admin registered successfully!");
    }

    // --- 3. REGISTER VENDOR (Existing) ---
    @Transactional
    @PostMapping("/register/vendor")
    public ResponseEntity<String> registerVendor(@RequestBody VendorRegistrationRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(400).body("Username is already taken!");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body("Email is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_VENDOR");
        User savedUser = userRepository.save(user);

        Vendor vendor = new Vendor();
        vendor.setVerified(false);
        vendor.setUser(savedUser);

        vendorRepository.save(vendor);

        return ResponseEntity.ok("Vendor registration successful! Please login.");
    }

    // --- 4. LOGIN USER (Existing) ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Error: User not found after authentication."));

            Boolean isVerified = null;
            if ("ROLE_VENDOR".equals(user.getRole())) {
                isVerified = vendorRepository.findByUserId(user.getId())
                        .map(Vendor::isVerified)
                        .orElse(false);
            }

            String jwt = jwtUtil.generateToken(userDetails, user.getId(), user.getRole());

            LoginResponse response = new LoginResponse(
                    "Login successful! Welcome, " + user.getUsername(),
                    user.getUsername(),
                    user.getRole(),
                    user.getEmail(),
                    user.getId(),
                    jwt,
                    isVerified
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error: Invalid email or password");
        }
    }
}