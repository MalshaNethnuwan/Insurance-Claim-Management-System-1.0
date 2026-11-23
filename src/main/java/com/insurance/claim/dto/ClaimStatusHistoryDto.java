package com.insurance.claim.dto;

import java.time.OffsetDateTime;

public class ClaimStatusHistoryDto {
    private Long id;
    private Long claimId;
    private String previousStatus;
    private String newStatus;
    private String updatedByName;
    private String reasonOrNotes;
    private OffsetDateTime createdAt;

    public ClaimStatusHistoryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public String getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(String previousStatus) { this.previousStatus = previousStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public String getUpdatedByName() { return updatedByName; }
    public void setUpdatedByName(String updatedByName) { this.updatedByName = updatedByName; }

    public String getReasonOrNotes() { return reasonOrNotes; }
    public void setReasonOrNotes(String reasonOrNotes) { this.reasonOrNotes = reasonOrNotes; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
