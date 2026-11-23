package com.insurance.claim.controller;

import com.insurance.claim.dto.OfficerDto;
import com.insurance.claim.service.OfficerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officers")
public class OfficerController {

    private final OfficerService officerService;

    public OfficerController(OfficerService officerService) {
        this.officerService = officerService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<List<OfficerDto>> getAllOfficers(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(officerService.searchOfficers(search));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<OfficerDto> getOfficerById(@PathVariable Long id) {
        return ResponseEntity.ok(officerService.getOfficerById(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<OfficerDto> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(officerService.getOfficerByUserId(authentication.getName()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OfficerDto> createOfficer(
            @Valid @RequestBody OfficerDto dto,
            Authentication authentication) {
        return ResponseEntity.ok(officerService.createOfficer(dto, authentication.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OfficerDto> updateOfficer(
            @PathVariable Long id,
            @Valid @RequestBody OfficerDto dto,
            Authentication authentication) {
        return ResponseEntity.ok(officerService.updateOfficer(id, dto, authentication.getName()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OfficerDto> toggleOfficerStatus(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(officerService.toggleOfficerStatus(id, authentication.getName()));
    }
}
