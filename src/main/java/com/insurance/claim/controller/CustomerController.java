package com.insurance.claim.controller;

import com.insurance.claim.dto.CustomerDto;
import com.insurance.claim.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<List<CustomerDto>> getAllCustomers(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(customerService.searchCustomers(search));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<CustomerDto> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(customerService.getCustomerByUserId(authentication.getName()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomerDto> createCustomer(
            @Valid @RequestBody CustomerDto dto,
            Authentication authentication) {
        return ResponseEntity.ok(customerService.createCustomer(dto, authentication.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomerDto> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerDto dto,
            Authentication authentication) {
        return ResponseEntity.ok(customerService.updateCustomer(id, dto, authentication.getName()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomerDto> toggleCustomerStatus(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(customerService.toggleCustomerStatus(id, authentication.getName()));
    }
}
