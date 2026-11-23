package com.insurance.claim.controller;

import com.insurance.claim.dto.PolicyDto;
import com.insurance.claim.service.PolicyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<List<PolicyDto>> getAllPolicies(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(policyService.searchPolicies(search));
    }

    @GetMapping("/my-policies")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<PolicyDto>> getMyPolicies(Authentication authentication) {
        return ResponseEntity.ok(policyService.getAllPoliciesByUserId(authentication.getName()));
    }

    @GetMapping("/my-policies/active")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<PolicyDto>> getMyActivePolicies(Authentication authentication) {
        return ResponseEntity.ok(policyService.getActivePoliciesByUserId(authentication.getName()));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<List<PolicyDto>> getPoliciesByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(policyService.getPoliciesByCustomerId(customerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyDto> getPolicyById(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.getPolicyById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyDto> createPolicy(@Valid @RequestBody PolicyDto dto) {
        return ResponseEntity.ok(policyService.createPolicy(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyDto> updatePolicy(
            @PathVariable Long id,
            @Valid @RequestBody PolicyDto dto) {
        return ResponseEntity.ok(policyService.updatePolicy(id, dto));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PolicyDto> togglePolicyStatus(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.togglePolicyStatus(id));
    }
}
