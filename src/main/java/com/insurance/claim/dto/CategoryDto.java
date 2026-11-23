package com.insurance.claim.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDto {
    private Long id;

    @NotBlank(message = "Category code is required")
    private String code;

    @NotBlank(message = "English name is required")
    private String nameEn;

    @NotBlank(message = "Sinhala name is required")
    private String nameSi;

    private String descriptionEn;
    private String descriptionSi;
    private String requiredDocuments;
    private String claimTypes;
    private boolean isActive = true;

    public CategoryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }

    public String getNameSi() { return nameSi; }
    public void setNameSi(String nameSi) { this.nameSi = nameSi; }

    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }

    public String getDescriptionSi() { return descriptionSi; }
    public void setDescriptionSi(String descriptionSi) { this.descriptionSi = descriptionSi; }

    public String getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(String requiredDocuments) { this.requiredDocuments = requiredDocuments; }

    public String getClaimTypes() { return claimTypes; }
    public void setClaimTypes(String claimTypes) { this.claimTypes = claimTypes; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
