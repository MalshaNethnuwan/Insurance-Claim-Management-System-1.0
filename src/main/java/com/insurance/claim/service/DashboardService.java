package com.insurance.claim.service;

import com.insurance.claim.dto.ClaimDto;
import com.insurance.claim.dto.DashboardStatsDto;
import com.insurance.claim.entity.*;
import com.insurance.claim.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final InsuranceOfficerRepository officerRepository;
    private final InsurancePolicyRepository policyRepository;
    private final InsuranceCategoryRepository categoryRepository;
    private final ClaimRepository claimRepository;
    private final ClaimService claimService;

    public DashboardService(UserRepository userRepository,
                            CustomerRepository customerRepository,
                            InsuranceOfficerRepository officerRepository,
                            InsurancePolicyRepository policyRepository,
                            InsuranceCategoryRepository categoryRepository,
                            ClaimRepository claimRepository,
                            ClaimService claimService) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.officerRepository = officerRepository;
        this.policyRepository = policyRepository;
        this.categoryRepository = categoryRepository;
        this.claimRepository = claimRepository;
        this.claimService = claimService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        DashboardStatsDto stats = new DashboardStatsDto();

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            stats.setTotalCustomers(customerRepository.count());
            stats.setTotalOfficers(officerRepository.count());
            stats.setTotalPolicies(policyRepository.count());
            stats.setTotalClaims(claimRepository.count());

            stats.setSubmittedClaims(claimRepository.countByStatus("SUBMITTED"));
            stats.setUnderReviewClaims(claimRepository.countByStatus("UNDER_REVIEW"));
            stats.setDocumentsRequiredClaims(claimRepository.countByStatus("DOCUMENTS_REQUIRED"));
            stats.setResubmittedClaims(claimRepository.countByStatus("RESUBMITTED"));
            stats.setApprovedClaims(claimRepository.countByStatus("APPROVED"));
            stats.setRejectedClaims(claimRepository.countByStatus("REJECTED"));
            stats.setSettlementPendingClaims(claimRepository.countByStatus("SETTLEMENT_PENDING"));
            stats.setSettledClaims(claimRepository.countByStatus("SETTLED"));
            stats.setClosedClaims(claimRepository.countByStatus("CLOSED"));

            Map<String, Long> categoryMap = new LinkedHashMap<>();
            List<InsuranceCategory> categories = categoryRepository.findAll();
            for (InsuranceCategory cat : categories) {
                categoryMap.put(cat.getNameEn(), claimRepository.countByCategory(cat));
            }
            stats.setClaimsByCategory(categoryMap);

            Map<String, Long> statusMap = new LinkedHashMap<>();
            statusMap.put("SUBMITTED", stats.getSubmittedClaims());
            statusMap.put("UNDER_REVIEW", stats.getUnderReviewClaims());
            statusMap.put("DOCUMENTS_REQUIRED", stats.getDocumentsRequiredClaims());
            statusMap.put("RESUBMITTED", stats.getResubmittedClaims());
            statusMap.put("APPROVED", stats.getApprovedClaims());
            statusMap.put("REJECTED", stats.getRejectedClaims());
            statusMap.put("SETTLEMENT_PENDING", stats.getSettlementPendingClaims());
            statusMap.put("SETTLED", stats.getSettledClaims());
            statusMap.put("CLOSED", stats.getClosedClaims());
            stats.setClaimsByStatus(statusMap);

            List<ClaimDto> recent = claimRepository.findAll().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(8)
                    .map(c -> claimService.mapToDto(c, false))
                    .collect(Collectors.toList());
            stats.setRecentClaims(recent);

        } else if ("OFFICER".equalsIgnoreCase(user.getRole())) {
            InsuranceOfficer officer = officerRepository.findByUser(user)
                    .orElseThrow(() -> new IllegalArgumentException("Officer not found"));

            List<Claim> officerClaims = claimRepository.findByOfficerOrCategoriesOrderByCreatedAtDesc(officer, officer.getCategories());

            stats.setTotalClaims(officerClaims.size());
            stats.setSubmittedClaims(officerClaims.stream().filter(c -> "SUBMITTED".equalsIgnoreCase(c.getStatus())).count());
            stats.setUnderReviewClaims(officerClaims.stream().filter(c -> "UNDER_REVIEW".equalsIgnoreCase(c.getStatus())).count());
            stats.setDocumentsRequiredClaims(officerClaims.stream().filter(c -> "DOCUMENTS_REQUIRED".equalsIgnoreCase(c.getStatus())).count());
            stats.setResubmittedClaims(officerClaims.stream().filter(c -> "RESUBMITTED".equalsIgnoreCase(c.getStatus())).count());
            stats.setApprovedClaims(officerClaims.stream().filter(c -> "APPROVED".equalsIgnoreCase(c.getStatus())).count());
            stats.setRejectedClaims(officerClaims.stream().filter(c -> "REJECTED".equalsIgnoreCase(c.getStatus())).count());
            stats.setSettlementPendingClaims(officerClaims.stream().filter(c -> "SETTLEMENT_PENDING".equalsIgnoreCase(c.getStatus())).count());
            stats.setSettledClaims(officerClaims.stream().filter(c -> "SETTLED".equalsIgnoreCase(c.getStatus())).count());
            stats.setClosedClaims(officerClaims.stream().filter(c -> "CLOSED".equalsIgnoreCase(c.getStatus())).count());

            Map<String, Long> categoryMap = new LinkedHashMap<>();
            for (InsuranceCategory cat : officer.getCategories()) {
                long cCount = officerClaims.stream().filter(c -> c.getCategory().getId().equals(cat.getId())).count();
                categoryMap.put(cat.getNameEn(), cCount);
            }
            stats.setClaimsByCategory(categoryMap);

            List<ClaimDto> recent = officerClaims.stream()
                    .limit(8)
                    .map(c -> claimService.mapToDto(c, false))
                    .collect(Collectors.toList());
            stats.setRecentClaims(recent);

        } else {
            Customer customer = customerRepository.findByUser(user)
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

            List<InsurancePolicy> policies = policyRepository.findByCustomer(customer);
            List<Claim> customerClaims = claimRepository.findByCustomerOrderByCreatedAtDesc(customer);

            stats.setTotalPolicies(policies.size());
            stats.setTotalClaims(customerClaims.size());
            stats.setSubmittedClaims(customerClaims.stream().filter(c -> "SUBMITTED".equalsIgnoreCase(c.getStatus())).count());
            stats.setUnderReviewClaims(customerClaims.stream().filter(c -> "UNDER_REVIEW".equalsIgnoreCase(c.getStatus())).count());
            stats.setDocumentsRequiredClaims(customerClaims.stream().filter(c -> "DOCUMENTS_REQUIRED".equalsIgnoreCase(c.getStatus())).count());
            stats.setResubmittedClaims(customerClaims.stream().filter(c -> "RESUBMITTED".equalsIgnoreCase(c.getStatus())).count());
            stats.setApprovedClaims(customerClaims.stream().filter(c -> "APPROVED".equalsIgnoreCase(c.getStatus())).count());
            stats.setRejectedClaims(customerClaims.stream().filter(c -> "REJECTED".equalsIgnoreCase(c.getStatus())).count());
            stats.setSettlementPendingClaims(customerClaims.stream().filter(c -> "SETTLEMENT_PENDING".equalsIgnoreCase(c.getStatus())).count());
            stats.setSettledClaims(customerClaims.stream().filter(c -> "SETTLED".equalsIgnoreCase(c.getStatus())).count());
            stats.setClosedClaims(customerClaims.stream().filter(c -> "CLOSED".equalsIgnoreCase(c.getStatus())).count());

            List<ClaimDto> recent = customerClaims.stream()
                    .limit(6)
                    .map(c -> claimService.mapToDto(c, false))
                    .collect(Collectors.toList());
            stats.setRecentClaims(recent);
        }

        return stats;
    }
}
