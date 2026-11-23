package com.insurance.claim.service;

import com.insurance.claim.dto.AuthRequest;
import com.insurance.claim.dto.AuthResponse;
import com.insurance.claim.dto.ChangePasswordRequest;
import com.insurance.claim.entity.Customer;
import com.insurance.claim.entity.InsuranceOfficer;
import com.insurance.claim.entity.User;
import com.insurance.claim.repository.CustomerRepository;
import com.insurance.claim.repository.InsuranceOfficerRepository;
import com.insurance.claim.repository.UserRepository;
import com.insurance.claim.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final InsuranceOfficerRepository officerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       CustomerRepository customerRepository,
                       InsuranceOfficerRepository officerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.officerRepository = officerRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new BadCredentialsException("Invalid User ID or Password"));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new BadCredentialsException("Account is deactivated. Please contact your administrator.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUserId(), request.getPassword())
            );
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid User ID or Password");
        }

        String fullName = "Administrator";
        Long entityId = user.getId();

        if ("CUSTOMER".equalsIgnoreCase(user.getRole())) {
            Customer customer = customerRepository.findByUser(user).orElse(null);
            if (customer != null) {
                fullName = customer.getFullName();
                entityId = customer.getId();
            }
        } else if ("OFFICER".equalsIgnoreCase(user.getRole())) {
            InsuranceOfficer officer = officerRepository.findByUser(user).orElse(null);
            if (officer != null) {
                fullName = officer.getFullName();
                entityId = officer.getId();
            }
        }

        String token = tokenProvider.generateToken(user.getUserId(), user.getRole(), entityId, fullName, user.isMustChangePassword());

        return new AuthResponse(token, user.getUserId(), fullName, user.getRole(), user.isMustChangePassword(), entityId);
    }

    @Transactional
    public void changePassword(String userId, ChangePasswordRequest request) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);
    }
}
