package com.insurance.claim.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class ClaimStatusUpdateRequest {
    @NotBlank(message = "Status is required")
    private String status;

    private String notes;
    private String rejectionReason;
    private BigDecimal approvedAmount;

    public ClaimStatusUpdateRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public BigDecimal getApprovedAmount() { return approvedAmount; }
    public void setApprovedAmount(BigDecimal approvedAmount) { this.approvedAmount = approvedAmount; }
}
