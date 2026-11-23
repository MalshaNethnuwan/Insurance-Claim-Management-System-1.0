package com.insurance.claim.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public class ClaimDto {
    private Long id;
    private String claimReference;
    private Long policyId;
    private String policyNumber;
    private String policyNameEn;
    private String policyNameSi;

    private Long customerId;
    private String customerName;
    private String customerNic;
    private String customerPhone;
    private String customerEmail;

    private Long categoryId;
    private String categoryCode;
    private String categoryNameEn;
    private String categoryNameSi;

    private Long assignedOfficerId;
    private String assignedOfficerName;
    private String assignedOfficerEmail;

    private String claimType;
    private LocalDate incidentDate;
    private String incidentLocation;
    private String description;
    private BigDecimal requestedAmount;
    private BigDecimal approvedAmount;
    private String status;
    private String rejectionReason;
    private String officerNotes;
    private String documentRequestNotes;

    private List<ClaimDocumentDto> documents;
    private List<ClaimStatusHistoryDto> statusHistories;
    private SettlementDto settlement;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public ClaimDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClaimReference() { return claimReference; }
    public void setClaimReference(String claimReference) { this.claimReference = claimReference; }

    public Long getPolicyId() { return policyId; }
    public void setPolicyId(Long policyId) { this.policyId = policyId; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public String getPolicyNameEn() { return policyNameEn; }
    public void setPolicyNameEn(String policyNameEn) { this.policyNameEn = policyNameEn; }

    public String getPolicyNameSi() { return policyNameSi; }
    public void setPolicyNameSi(String policyNameSi) { this.policyNameSi = policyNameSi; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerNic() { return customerNic; }
    public void setCustomerNic(String customerNic) { this.customerNic = customerNic; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryCode() { return categoryCode; }
    public void setCategoryCode(String categoryCode) { this.categoryCode = categoryCode; }

    public String getCategoryNameEn() { return categoryNameEn; }
    public void setCategoryNameEn(String categoryNameEn) { this.categoryNameEn = categoryNameEn; }

    public String getCategoryNameSi() { return categoryNameSi; }
    public void setCategoryNameSi(String categoryNameSi) { this.categoryNameSi = categoryNameSi; }

    public Long getAssignedOfficerId() { return assignedOfficerId; }
    public void setAssignedOfficerId(Long assignedOfficerId) { this.assignedOfficerId = assignedOfficerId; }

    public String getAssignedOfficerName() { return assignedOfficerName; }
    public void setAssignedOfficerName(String assignedOfficerName) { this.assignedOfficerName = assignedOfficerName; }

    public String getAssignedOfficerEmail() { return assignedOfficerEmail; }
    public void setAssignedOfficerEmail(String assignedOfficerEmail) { this.assignedOfficerEmail = assignedOfficerEmail; }

    public String getClaimType() { return claimType; }
    public void setClaimType(String claimType) { this.claimType = claimType; }

    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }

    public String getIncidentLocation() { return incidentLocation; }
    public void setIncidentLocation(String incidentLocation) { this.incidentLocation = incidentLocation; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getRequestedAmount() { return requestedAmount; }
    public void setRequestedAmount(BigDecimal requestedAmount) { this.requestedAmount = requestedAmount; }

    public BigDecimal getApprovedAmount() { return approvedAmount; }
    public void setApprovedAmount(BigDecimal approvedAmount) { this.approvedAmount = approvedAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getOfficerNotes() { return officerNotes; }
    public void setOfficerNotes(String officerNotes) { this.officerNotes = officerNotes; }

    public String getDocumentRequestNotes() { return documentRequestNotes; }
    public void setDocumentRequestNotes(String documentRequestNotes) { this.documentRequestNotes = documentRequestNotes; }

    public List<ClaimDocumentDto> getDocuments() { return documents; }
    public void setDocuments(List<ClaimDocumentDto> documents) { this.documents = documents; }

    public List<ClaimStatusHistoryDto> getStatusHistories() { return statusHistories; }
    public void setStatusHistories(List<ClaimStatusHistoryDto> statusHistories) { this.statusHistories = statusHistories; }

    public SettlementDto getSettlement() { return settlement; }
    public void setSettlement(SettlementDto settlement) { this.settlement = settlement; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
