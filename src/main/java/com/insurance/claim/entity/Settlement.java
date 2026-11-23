package com.insurance.claim.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "settlements")
public class Settlement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false, unique = true)
    private Claim claim;

    @Column(name = "settlement_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal settlementAmount;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod; // BANK_TRANSFER, CHEQUE

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "settlement_notes", columnDefinition = "TEXT")
    private String settlementNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "settled_by_user_id", nullable = false)
    private User settledByUser;

    @Column(name = "settlement_date")
    private OffsetDateTime settlementDate = OffsetDateTime.now();

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Settlement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Claim getClaim() { return claim; }
    public void setClaim(Claim claim) { this.claim = claim; }

    public BigDecimal getSettlementAmount() { return settlementAmount; }
    public void setSettlementAmount(BigDecimal settlementAmount) { this.settlementAmount = settlementAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public String getSettlementNotes() { return settlementNotes; }
    public void setSettlementNotes(String settlementNotes) { this.settlementNotes = settlementNotes; }

    public User getSettledByUser() { return settledByUser; }
    public void setSettledByUser(User settledByUser) { this.settledByUser = settledByUser; }

    public OffsetDateTime getSettlementDate() { return settlementDate; }
    public void setSettlementDate(OffsetDateTime settlementDate) { this.settlementDate = settlementDate; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
