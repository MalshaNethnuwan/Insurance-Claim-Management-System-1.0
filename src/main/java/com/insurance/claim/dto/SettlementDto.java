package com.insurance.claim.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class SettlementDto {
    private Long id;
    private Long claimId;

    @NotNull(message = "Settlement amount is required")
    private BigDecimal settlementAmount;

    @NotNull(message = "Payment method is required")
    private String paymentMethod; // BANK_TRANSFER, CHEQUE

    private String paymentReference;
    private String settlementNotes;
    private String settledByName;
    private OffsetDateTime settlementDate;

    public SettlementDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public BigDecimal getSettlementAmount() { return settlementAmount; }
    public void setSettlementAmount(BigDecimal settlementAmount) { this.settlementAmount = settlementAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public String getSettlementNotes() { return settlementNotes; }
    public void setSettlementNotes(String settlementNotes) { this.settlementNotes = settlementNotes; }

    public String getSettledByName() { return settledByName; }
    public void setSettledByName(String settledByName) { this.settledByName = settledByName; }

    public OffsetDateTime getSettlementDate() { return settlementDate; }
    public void setSettlementDate(OffsetDateTime settlementDate) { this.settlementDate = settlementDate; }
}
