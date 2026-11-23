package com.insurance.claim.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalCustomers;
    private long totalOfficers;
    private long totalPolicies;
    private long totalClaims;

    private long submittedClaims;
    private long underReviewClaims;
    private long documentsRequiredClaims;
    private long resubmittedClaims;
    private long approvedClaims;
    private long rejectedClaims;
    private long settlementPendingClaims;
    private long settledClaims;
    private long closedClaims;

    private Map<String, Long> claimsByCategory;
    private Map<String, Long> claimsByStatus;
    private List<ClaimDto> recentClaims;

    public DashboardStatsDto() {}

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalOfficers() { return totalOfficers; }
    public void setTotalOfficers(long totalOfficers) { this.totalOfficers = totalOfficers; }

    public long getTotalPolicies() { return totalPolicies; }
    public void setTotalPolicies(long totalPolicies) { this.totalPolicies = totalPolicies; }

    public long getTotalClaims() { return totalClaims; }
    public void setTotalClaims(long totalClaims) { this.totalClaims = totalClaims; }

    public long getSubmittedClaims() { return submittedClaims; }
    public void setSubmittedClaims(long submittedClaims) { this.submittedClaims = submittedClaims; }

    public long getUnderReviewClaims() { return underReviewClaims; }
    public void setUnderReviewClaims(long underReviewClaims) { this.underReviewClaims = underReviewClaims; }

    public long getDocumentsRequiredClaims() { return documentsRequiredClaims; }
    public void setDocumentsRequiredClaims(long documentsRequiredClaims) { this.documentsRequiredClaims = documentsRequiredClaims; }

    public long getResubmittedClaims() { return resubmittedClaims; }
    public void setResubmittedClaims(long resubmittedClaims) { this.resubmittedClaims = resubmittedClaims; }

    public long getApprovedClaims() { return approvedClaims; }
    public void setApprovedClaims(long approvedClaims) { this.approvedClaims = approvedClaims; }

    public long getRejectedClaims() { return rejectedClaims; }
    public void setRejectedClaims(long rejectedClaims) { this.rejectedClaims = rejectedClaims; }

    public long getSettlementPendingClaims() { return settlementPendingClaims; }
    public void setSettlementPendingClaims(long settlementPendingClaims) { this.settlementPendingClaims = settlementPendingClaims; }

    public long getSettledClaims() { return settledClaims; }
    public void setSettledClaims(long settledClaims) { this.settledClaims = settledClaims; }

    public long getClosedClaims() { return closedClaims; }
    public void setClosedClaims(long closedClaims) { this.closedClaims = closedClaims; }

    public Map<String, Long> getClaimsByCategory() { return claimsByCategory; }
    public void setClaimsByCategory(Map<String, Long> claimsByCategory) { this.claimsByCategory = claimsByCategory; }

    public Map<String, Long> getClaimsByStatus() { return claimsByStatus; }
    public void setClaimsByStatus(Map<String, Long> claimsByStatus) { this.claimsByStatus = claimsByStatus; }

    public List<ClaimDto> getRecentClaims() { return recentClaims; }
    public void setRecentClaims(List<ClaimDto> recentClaims) { this.recentClaims = recentClaims; }
}
