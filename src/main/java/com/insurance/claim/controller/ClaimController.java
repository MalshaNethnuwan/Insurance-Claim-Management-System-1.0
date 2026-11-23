package com.insurance.claim.controller;

import com.insurance.claim.dto.ClaimDto;
import com.insurance.claim.dto.ClaimStatusUpdateRequest;
import com.insurance.claim.dto.RequestDocsRequest;
import com.insurance.claim.dto.SettlementDto;
import com.insurance.claim.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ClaimDto> submitClaim(
            @Valid @RequestBody ClaimDto dto,
            Authentication authentication) {
        return ResponseEntity.ok(claimService.submitClaim(dto, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ClaimDto>> getClaims(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            Authentication authentication) {
        return ResponseEntity.ok(claimService.getClaimsForUser(authentication.getName(), status, categoryId, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClaimDto> getClaimById(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(claimService.getClaimById(id, authentication.getName()));
    }

    @GetMapping("/track/{reference}")
    public ResponseEntity<ClaimDto> trackClaim(
            @PathVariable String reference,
            Authentication authentication) {
        return ResponseEntity.ok(claimService.trackClaim(reference, authentication.getName()));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClaimDto> assignOfficer(
            @PathVariable Long id,
            @RequestBody Map<String, Long> payload,
            Authentication authentication) {
        Long officerId = payload.get("officerId");
        if (officerId == null) {
            throw new IllegalArgumentException("officerId is required");
        }
        return ResponseEntity.ok(claimService.assignOfficer(id, officerId, authentication.getName()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
    public ResponseEntity<ClaimDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ClaimStatusUpdateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(claimService.updateStatus(id, request, authentication.getName()));
    }

    @PostMapping("/{id}/request-documents")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
    public ResponseEntity<ClaimDto> requestDocuments(
            @PathVariable Long id,
            @Valid @RequestBody RequestDocsRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(claimService.requestDocuments(id, request, authentication.getName()));
    }

    @PostMapping("/{id}/resubmit")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ClaimDto> resubmitDocuments(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(claimService.notifyResubmitted(id, authentication.getName()));
    }

    @PostMapping("/{id}/settlement")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
    public ResponseEntity<ClaimDto> recordSettlement(
            @PathVariable Long id,
            @Valid @RequestBody SettlementDto dto,
            Authentication authentication) {
        return ResponseEntity.ok(claimService.recordSettlement(id, dto, authentication.getName()));
    }
}
