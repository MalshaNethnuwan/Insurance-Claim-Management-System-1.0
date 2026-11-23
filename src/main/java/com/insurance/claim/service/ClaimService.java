package com.insurance.claim.service;

import com.insurance.claim.dto.*;
import com.insurance.claim.entity.*;
import com.insurance.claim.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final InsurancePolicyRepository policyRepository;
    private final CustomerRepository customerRepository;
    private final InsuranceCategoryRepository categoryRepository;
    private final InsuranceOfficerRepository officerRepository;
    private final UserRepository userRepository;
    private final ClaimStatusHistoryRepository historyRepository;
    private final SettlementRepository settlementRepository;
    private final NotificationService notificationService;
    private final AuditLogRepository auditLogRepository;

    public ClaimService(ClaimRepository claimRepository,
                        InsurancePolicyRepository policyRepository,
                        CustomerRepository customerRepository,
                        InsuranceCategoryRepository categoryRepository,
                        InsuranceOfficerRepository officerRepository,
                        UserRepository userRepository,
                        ClaimStatusHistoryRepository historyRepository,
                        SettlementRepository settlementRepository,
                        NotificationService notificationService,
                        AuditLogRepository auditLogRepository) {
        this.claimRepository = claimRepository;
        this.policyRepository = policyRepository;
        this.customerRepository = customerRepository;
        this.categoryRepository = categoryRepository;
        this.officerRepository = officerRepository;
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
        this.settlementRepository = settlementRepository;
        this.notificationService = notificationService;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public ClaimDto submitClaim(ClaimDto dto, String customerUserId) {
        User user = userRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + customerUserId));

        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Customer record not found for: " + customerUserId));

        InsurancePolicy policy = policyRepository.findById(dto.getPolicyId())
                .orElseThrow(() -> new IllegalArgumentException("Policy not found with id: " + dto.getPolicyId()));

        if (!policy.getCustomer().getId().equals(customer.getId())) {
            throw new AccessDeniedException("This policy does not belong to you");
        }

        if (!"ACTIVE".equalsIgnoreCase(policy.getStatus())) {
            throw new IllegalArgumentException("Claims can only be submitted against active policies");
        }

        if (policy.getExpiryDate().isBefore(dto.getIncidentDate())) {
            throw new IllegalArgumentException("Incident date is after policy expiry date");
        }

        long count = claimRepository.count();
        String claimReference = String.format("CLM-2026-%04d", count + 1);

        Claim claim = new Claim();
        claim.setClaimReference(claimReference);
        claim.setPolicy(policy);
        claim.setCustomer(customer);
        claim.setCategory(policy.getCategory());
        claim.setClaimType(dto.getClaimType());
        claim.setIncidentDate(dto.getIncidentDate());
        claim.setIncidentLocation(dto.getIncidentLocation());
        claim.setDescription(dto.getDescription());
        claim.setRequestedAmount(dto.getRequestedAmount());
        claim.setStatus("SUBMITTED");

        // Try to auto-assign to an officer in this category
        List<InsuranceOfficer> categoryOfficers = officerRepository.findByCategory(policy.getCategory());
        if (!categoryOfficers.isEmpty()) {
            claim.setAssignedOfficer(categoryOfficers.get((int) (count % categoryOfficers.size())));
        }

        claim = claimRepository.save(claim);

        // Record history
        recordHistory(claim, null, "SUBMITTED", user, customer.getFullName(), "Claim submitted online.");

        // Notifications
        notificationService.sendNotification(user,
                "Claim Submitted Successfully",
                "හිමිකම් පෑම සාර්ථකව ඉදිරිපත් කරන ලදී",
                "Your claim " + claimReference + " for " + policy.getCategory().getNameEn() + " has been submitted.",
                "ඔබගේ " + claimReference + " දරන හිමිකම් පෑම සාර්ථකව ලැබුණි.",
                claim);

        if (claim.getAssignedOfficer() != null && claim.getAssignedOfficer().getUser() != null) {
            notificationService.sendNotification(claim.getAssignedOfficer().getUser(),
                    "New Claim Assigned",
                    "නව හිමිකම් පෑමක් පවරන ලදී",
                    "New claim " + claimReference + " submitted by " + customer.getFullName() + " assigned to you.",
                    "නව හිමිකම් පෑමක් " + claimReference + " ඔබට පවරා ඇත.",
                    claim);
        }

        auditLogRepository.save(new AuditLog(customerUserId, "SUBMIT_CLAIM", "Claim", claim.getId().toString(),
                "Submitted claim " + claimReference + " for Rs. " + claim.getRequestedAmount(), "127.0.0.1"));

        return mapToDto(claim, true);
    }

    @Transactional(readOnly = true)
    public List<ClaimDto> getClaimsForUser(String userId, String status, Long categoryId, String query) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        List<Claim> claims;

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            claims = claimRepository.findAll();
        } else if ("OFFICER".equalsIgnoreCase(user.getRole())) {
            InsuranceOfficer officer = officerRepository.findByUser(user)
                    .orElseThrow(() -> new IllegalArgumentException("Officer profile not found"));
            claims = claimRepository.findByOfficerOrCategoriesOrderByCreatedAtDesc(officer, officer.getCategories());
        } else {
            Customer customer = customerRepository.findByUser(user)
                    .orElseThrow(() -> new IllegalArgumentException("Customer profile not found"));
            claims = claimRepository.findByCustomerOrderByCreatedAtDesc(customer);
        }

        // Apply filters
        return claims.stream()
                .filter(c -> status == null || status.isBlank() || c.getStatus().equalsIgnoreCase(status.trim()))
                .filter(c -> categoryId == null || (c.getCategory() != null && c.getCategory().getId().equals(categoryId)))
                .filter(c -> {
                    if (query == null || query.isBlank()) return true;
                    String q = query.toLowerCase().trim();
                    return c.getClaimReference().toLowerCase().contains(q) ||
                            (c.getCustomer() != null && c.getCustomer().getFullName().toLowerCase().contains(q)) ||
                            (c.getPolicy() != null && c.getPolicy().getPolicyNumber().toLowerCase().contains(q));
                })
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(c -> mapToDto(c, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClaimDto getClaimById(Long id, String userId) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with id: " + id));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        validateClaimViewAccess(claim, user);

        return mapToDto(claim, true);
    }

    @Transactional(readOnly = true)
    public ClaimDto trackClaim(String claimReference, String userId) {
        Claim claim = claimRepository.findByClaimReference(claimReference.trim())
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with reference: " + claimReference));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        validateClaimViewAccess(claim, user);

        return mapToDto(claim, true);
    }

    @Transactional
    public ClaimDto assignOfficer(Long claimId, Long officerId, String adminUserId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with id: " + claimId));

        InsuranceOfficer officer = officerRepository.findById(officerId)
                .orElseThrow(() -> new IllegalArgumentException("Officer not found with id: " + officerId));

        User admin = userRepository.findByUserId(adminUserId)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found"));

        claim.setAssignedOfficer(officer);
        claim.setUpdatedAt(OffsetDateTime.now());
        claim = claimRepository.save(claim);

        recordHistory(claim, claim.getStatus(), claim.getStatus(), admin, "Administrator",
                "Assigned to officer " + officer.getFullName());

        if (officer.getUser() != null) {
            notificationService.sendNotification(officer.getUser(),
                    "Claim Assigned by Administrator",
                    "පරිපාලක විසින් හිමිකම් පෑමක් පවරන ලදී",
                    "Claim " + claim.getClaimReference() + " has been assigned to you.",
                    claim.getClaimReference() + " දරන හිමිකම් පෑම ඔබට පවරන ලදී.",
                    claim);
        }

        return mapToDto(claim, true);
    }

    @Transactional
    public ClaimDto updateStatus(Long claimId, ClaimStatusUpdateRequest request, String userId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with id: " + claimId));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        validateOfficerOrAdminAccess(claim, user);

        String previousStatus = claim.getStatus();
        String newStatus = request.getStatus().toUpperCase().trim();

        claim.setStatus(newStatus);
        if (request.getNotes() != null) {
            claim.setOfficerNotes(request.getNotes());
        }
        if (request.getRejectionReason() != null) {
            claim.setRejectionReason(request.getRejectionReason());
        }
        if (request.getApprovedAmount() != null) {
            claim.setApprovedAmount(request.getApprovedAmount());
        }
        claim.setUpdatedAt(OffsetDateTime.now());
        claim = claimRepository.save(claim);

        String updaterName = user.getUserId();
        if ("OFFICER".equalsIgnoreCase(user.getRole())) {
            InsuranceOfficer officer = officerRepository.findByUser(user).orElse(null);
            if (officer != null) updaterName = officer.getFullName();
        } else if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            updaterName = "Administrator";
        }

        String noteText = request.getNotes();
        if ("REJECTED".equalsIgnoreCase(newStatus) && request.getRejectionReason() != null) {
            noteText = "Rejected: " + request.getRejectionReason();
        } else if ("APPROVED".equalsIgnoreCase(newStatus) && request.getApprovedAmount() != null) {
            noteText = "Approved for Rs. " + request.getApprovedAmount();
        }

        recordHistory(claim, previousStatus, newStatus, user, updaterName, noteText);

        // Notify customer
        if (claim.getCustomer() != null && claim.getCustomer().getUser() != null) {
            String titleEn = "Claim Status Updated: " + newStatus;
            String titleSi = "හිමිකම් පෑමේ තත්වය යාවත්කාලීන විය: " + getStatusSi(newStatus);
            String msgEn = "Your claim " + claim.getClaimReference() + " is now " + newStatus + ". " + (noteText != null ? noteText : "");
            String msgSi = "ඔබගේ " + claim.getClaimReference() + " දරන හිමිකම් පෑමේ නව තත්වය: " + getStatusSi(newStatus);

            notificationService.sendNotification(claim.getCustomer().getUser(), titleEn, titleSi, msgEn, msgSi, claim);
        }

        auditLogRepository.save(new AuditLog(userId, "UPDATE_CLAIM_STATUS", "Claim", claim.getId().toString(),
                "Changed status from " + previousStatus + " to " + newStatus + " for " + claim.getClaimReference(), "127.0.0.1"));

        return mapToDto(claim, true);
    }

    @Transactional
    public ClaimDto requestDocuments(Long claimId, RequestDocsRequest request, String officerUserId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with id: " + claimId));

        User user = userRepository.findByUserId(officerUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + officerUserId));

        validateOfficerOrAdminAccess(claim, user);

        String prev = claim.getStatus();
        claim.setStatus("DOCUMENTS_REQUIRED");
        claim.setDocumentRequestNotes(request.getDocumentRequestNotes());
        claim.setUpdatedAt(OffsetDateTime.now());
        claim = claimRepository.save(claim);

        String updaterName = user.getUserId();
        InsuranceOfficer officer = officerRepository.findByUser(user).orElse(null);
        if (officer != null) updaterName = officer.getFullName();

        recordHistory(claim, prev, "DOCUMENTS_REQUIRED", user, updaterName,
                "Requested additional documents: " + request.getDocumentRequestNotes());

        if (claim.getCustomer() != null && claim.getCustomer().getUser() != null) {
            notificationService.sendNotification(claim.getCustomer().getUser(),
                    "Additional Documents Required",
                    "අමතර ලියකියවිලි අවශ්‍යයි",
                    "Officer requested additional documents for " + claim.getClaimReference() + ": " + request.getDocumentRequestNotes(),
                    "නිලධාරී ඔබගේ " + claim.getClaimReference() + " හිමිකම් පෑමට අමතර ලියකියවිලි ඉල්ලා ඇත: " + request.getDocumentRequestNotes(),
                    claim);
        }

        return mapToDto(claim, true);
    }

    @Transactional
    public ClaimDto notifyResubmitted(Long claimId, String customerUserId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with id: " + claimId));

        User user = userRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + customerUserId));

        String prev = claim.getStatus();
        claim.setStatus("RESUBMITTED");
        claim.setUpdatedAt(OffsetDateTime.now());
        claim = claimRepository.save(claim);

        Customer customer = customerRepository.findByUser(user).orElse(null);
        String custName = customer != null ? customer.getFullName() : customerUserId;

        recordHistory(claim, prev, "RESUBMITTED", user, custName, "Customer uploaded requested documents.");

        if (claim.getAssignedOfficer() != null && claim.getAssignedOfficer().getUser() != null) {
            notificationService.sendNotification(claim.getAssignedOfficer().getUser(),
                    "Claim Resubmitted with Documents",
                    "හිමිකම් පෑම නැවත ඉදිරිපත් කරන ලදී",
                    "Customer " + custName + " has uploaded requested documents for " + claim.getClaimReference(),
                    custName + " පාරිභෝගිකයා " + claim.getClaimReference() + " සඳහා ලියකියවිලි උඩුගත කළේය.",
                    claim);
        }

        return mapToDto(claim, true);
    }

    @Transactional
    public ClaimDto recordSettlement(Long claimId, SettlementDto dto, String userId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with id: " + claimId));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        validateOfficerOrAdminAccess(claim, user);

        Settlement settlement = new Settlement();
        settlement.setClaim(claim);
        settlement.setSettlementAmount(dto.getSettlementAmount());
        settlement.setPaymentMethod(dto.getPaymentMethod());
        settlement.setPaymentReference(dto.getPaymentReference());
        settlement.setSettlementNotes(dto.getSettlementNotes());
        settlement.setSettledByUser(user);
        settlement.setSettlementDate(OffsetDateTime.now());
        settlementRepository.save(settlement);

        String prev = claim.getStatus();
        claim.setStatus("SETTLED");
        claim.setUpdatedAt(OffsetDateTime.now());
        claim = claimRepository.save(claim);

        recordHistory(claim, prev, "SETTLED", user, user.getUserId(),
                "Settled amount of Rs. " + dto.getSettlementAmount() + " via " + dto.getPaymentMethod() + " (Ref: " + dto.getPaymentReference() + ")");

        if (claim.getCustomer() != null && claim.getCustomer().getUser() != null) {
            notificationService.sendNotification(claim.getCustomer().getUser(),
                    "Claim Successfully Settled",
                    "හිමිකම් පෑම සඳහා ගෙවීම් කරන ලදී",
                    "Your claim " + claim.getClaimReference() + " has been settled with Rs. " + dto.getSettlementAmount() + " via " + dto.getPaymentMethod() + ".",
                    "ඔබගේ " + claim.getClaimReference() + " හිමිකම් පෑමට රු. " + dto.getSettlementAmount() + " මුදලක් ගෙවන ලදී.",
                    claim);
        }

        return mapToDto(claim, true);
    }

    private void recordHistory(Claim claim, String prev, String next, User user, String name, String notes) {
        ClaimStatusHistory history = new ClaimStatusHistory();
        history.setClaim(claim);
        history.setPreviousStatus(prev);
        history.setNewStatus(next);
        history.setUpdatedByUser(user);
        history.setUpdatedByName(name);
        history.setReasonOrNotes(notes);
        historyRepository.save(history);
    }

    private void validateClaimViewAccess(Claim claim, User user) {
        if ("ADMIN".equalsIgnoreCase(user.getRole())) return;

        if ("CUSTOMER".equalsIgnoreCase(user.getRole())) {
            if (claim.getCustomer() == null || claim.getCustomer().getUser() == null ||
                !claim.getCustomer().getUser().getUserId().equals(user.getUserId())) {
                throw new AccessDeniedException("You do not have access to this claim");
            }
            return;
        }

        if ("OFFICER".equalsIgnoreCase(user.getRole())) {
            InsuranceOfficer officer = officerRepository.findByUser(user).orElse(null);
            if (officer == null) throw new AccessDeniedException("Officer profile not found");

            boolean isAssigned = claim.getAssignedOfficer() != null &&
                    claim.getAssignedOfficer().getId().equals(officer.getId());

            boolean isCategoryAuthorized = officer.getCategories() != null &&
                    officer.getCategories().stream().anyMatch(cat -> cat.getId().equals(claim.getCategory().getId()));

            if (!isAssigned && !isCategoryAuthorized) {
                throw new AccessDeniedException("You are not authorized to view claims outside your assigned categories");
            }
        }
    }

    private void validateOfficerOrAdminAccess(Claim claim, User user) {
        if ("ADMIN".equalsIgnoreCase(user.getRole())) return;

        if ("OFFICER".equalsIgnoreCase(user.getRole())) {
            InsuranceOfficer officer = officerRepository.findByUser(user).orElse(null);
            if (officer == null) throw new AccessDeniedException("Officer profile not found");

            boolean isAssigned = claim.getAssignedOfficer() != null &&
                    claim.getAssignedOfficer().getId().equals(officer.getId());

            boolean isCategoryAuthorized = officer.getCategories() != null &&
                    officer.getCategories().stream().anyMatch(cat -> cat.getId().equals(claim.getCategory().getId()));

            if (!isAssigned && !isCategoryAuthorized) {
                throw new AccessDeniedException("You are not authorized to update this claim");
            }
            return;
        }

        throw new AccessDeniedException("Only officers and administrators can process claims");
    }

    private String getStatusSi(String status) {
        switch (status) {
            case "SUBMITTED": return "ඉදිරිපත් කරන ලදී";
            case "UNDER_REVIEW": return "සමාලෝචනය වෙමින්";
            case "DOCUMENTS_REQUIRED": return "ලියකියවිලි අවශ්‍යයි";
            case "RESUBMITTED": return "නැවත ඉදිරිපත් කරන ලදී";
            case "APPROVED": return "අනුමත විය";
            case "REJECTED": return "ප්‍රතික්ෂේප විය";
            case "SETTLEMENT_PENDING": return "ගෙවීම් බලාපොරොත්තුවෙන්";
            case "SETTLED": return "ගෙවීම් සම්පූර්ණයි";
            case "CLOSED": return "ගොනුව වසා ඇත";
            default: return status;
        }
    }

    public ClaimDto mapToDto(Claim c, boolean includeDetails) {
        ClaimDto dto = new ClaimDto();
        dto.setId(c.getId());
        dto.setClaimReference(c.getClaimReference());

        if (c.getPolicy() != null) {
            dto.setPolicyId(c.getPolicy().getId());
            dto.setPolicyNumber(c.getPolicy().getPolicyNumber());
            dto.setPolicyNameEn(c.getPolicy().getPolicyNameEn());
            dto.setPolicyNameSi(c.getPolicy().getPolicyNameSi());
        }

        if (c.getCustomer() != null) {
            dto.setCustomerId(c.getCustomer().getId());
            dto.setCustomerName(c.getCustomer().getFullName());
            dto.setCustomerNic(c.getCustomer().getNicNumber());
            dto.setCustomerPhone(c.getCustomer().getPhoneNumber());
            dto.setCustomerEmail(c.getCustomer().getEmail());
        }

        if (c.getCategory() != null) {
            dto.setCategoryId(c.getCategory().getId());
            dto.setCategoryCode(c.getCategory().getCode());
            dto.setCategoryNameEn(c.getCategory().getNameEn());
            dto.setCategoryNameSi(c.getCategory().getNameSi());
        }

        if (c.getAssignedOfficer() != null) {
            dto.setAssignedOfficerId(c.getAssignedOfficer().getId());
            dto.setAssignedOfficerName(c.getAssignedOfficer().getFullName());
            dto.setAssignedOfficerEmail(c.getAssignedOfficer().getEmail());
        }

        dto.setClaimType(c.getClaimType());
        dto.setIncidentDate(c.getIncidentDate());
        dto.setIncidentLocation(c.getIncidentLocation());
        dto.setDescription(c.getDescription());
        dto.setRequestedAmount(c.getRequestedAmount());
        dto.setApprovedAmount(c.getApprovedAmount());
        dto.setStatus(c.getStatus());
        dto.setRejectionReason(c.getRejectionReason());
        dto.setOfficerNotes(c.getOfficerNotes());
        dto.setDocumentRequestNotes(c.getDocumentRequestNotes());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());

        if (includeDetails) {
            if (c.getDocuments() != null) {
                dto.setDocuments(c.getDocuments().stream().map(d -> {
                    ClaimDocumentDto docDto = new ClaimDocumentDto();
                    docDto.setId(d.getId());
                    docDto.setClaimId(c.getId());
                    docDto.setDocumentName(d.getDocumentName());
                    docDto.setDocumentType(d.getDocumentType());
                    docDto.setFileSize(d.getFileSize());
                    docDto.setContentType(d.getContentType());
                    docDto.setAdditionalRequest(d.isAdditionalRequest());
                    docDto.setUploadedByName(d.getUploadedBy() != null ? d.getUploadedBy().getUserId() : null);
                    docDto.setUploadedAt(d.getUploadedAt());
                    return docDto;
                }).collect(Collectors.toList()));
            }

            if (c.getStatusHistories() != null) {
                dto.setStatusHistories(c.getStatusHistories().stream().map(h -> {
                    ClaimStatusHistoryDto histDto = new ClaimStatusHistoryDto();
                    histDto.setId(h.getId());
                    histDto.setClaimId(c.getId());
                    histDto.setPreviousStatus(h.getPreviousStatus());
                    histDto.setNewStatus(h.getNewStatus());
                    histDto.setUpdatedByName(h.getUpdatedByName());
                    histDto.setReasonOrNotes(h.getReasonOrNotes());
                    histDto.setCreatedAt(h.getCreatedAt());
                    return histDto;
                }).collect(Collectors.toList()));
            }

            if (c.getSettlement() != null) {
                Settlement s = c.getSettlement();
                SettlementDto setDto = new SettlementDto();
                setDto.setId(s.getId());
                setDto.setClaimId(c.getId());
                setDto.setSettlementAmount(s.getSettlementAmount());
                setDto.setPaymentMethod(s.getPaymentMethod());
                setDto.setPaymentReference(s.getPaymentReference());
                setDto.setSettlementNotes(s.getSettlementNotes());
                setDto.setSettledByName(s.getSettledByUser() != null ? s.getSettledByUser().getUserId() : null);
                setDto.setSettlementDate(s.getSettlementDate());
                dto.setSettlement(setDto);
            }
        }

        return dto;
    }
}
