package com.insurance.claim.dto;

import java.time.OffsetDateTime;

public class ClaimDocumentDto {
    private Long id;
    private Long claimId;
    private String documentName;
    private String documentType;
    private Long fileSize;
    private String contentType;
    private boolean isAdditionalRequest;
    private String uploadedByName;
    private OffsetDateTime uploadedAt;

    public ClaimDocumentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public boolean isAdditionalRequest() { return isAdditionalRequest; }
    public void setAdditionalRequest(boolean additionalRequest) { isAdditionalRequest = additionalRequest; }

    public String getUploadedByName() { return uploadedByName; }
    public void setUploadedByName(String uploadedByName) { this.uploadedByName = uploadedByName; }

    public OffsetDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(OffsetDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
