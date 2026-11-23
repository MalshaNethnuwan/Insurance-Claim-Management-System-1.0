package com.insurance.claim.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class PolicyDto {
    private Long id;
    private String policyNumber;

    @NotNull(message = "Policy name English is required")
    private String policyNameEn;

    private String policyNameSi;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
    private String categoryNameEn;
    private String categoryNameSi;
    private String categoryCode;

    @NotNull(message = "Customer ID is required")
    private Long customerId;
    private String customerName;
    private String customerCode;

    @NotNull(message = "Coverage amount is required")
    private BigDecimal coverageAmount;

    private BigDecimal premiumAmount;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    private String status = "ACTIVE";

    public PolicyDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public String getPolicyNameEn() { return policyNameEn; }
    public void setPolicyNameEn(String policyNameEn) { this.policyNameEn = policyNameEn; }

    public String getPolicyNameSi() { return policyNameSi; }
    public void setPolicyNameSi(String policyNameSi) { this.policyNameSi = policyNameSi; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryNameEn() { return categoryNameEn; }
    public void setCategoryNameEn(String categoryNameEn) { this.categoryNameEn = categoryNameEn; }

    public String getCategoryNameSi() { return categoryNameSi; }
    public void setCategoryNameSi(String categoryNameSi) { this.categoryNameSi = categoryNameSi; }

    public String getCategoryCode() { return categoryCode; }
    public void setCategoryCode(String categoryCode) { this.categoryCode = categoryCode; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerCode() { return customerCode; }
    public void setCustomerCode(String customerCode) { this.customerCode = customerCode; }

    public BigDecimal getCoverageAmount() { return coverageAmount; }
    public void setCoverageAmount(BigDecimal coverageAmount) { this.coverageAmount = coverageAmount; }

    public BigDecimal getPremiumAmount() { return premiumAmount; }
    public void setPremiumAmount(BigDecimal premiumAmount) { this.premiumAmount = premiumAmount; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
