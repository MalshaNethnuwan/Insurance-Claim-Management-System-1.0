package com.insurance.claim.dto;

import java.time.OffsetDateTime;

public class NotificationDto {
    private Long id;
    private Long userId;
    private String titleEn;
    private String titleSi;
    private String messageEn;
    private String messageSi;
    private Long claimId;
    private boolean isRead;
    private OffsetDateTime createdAt;

    public NotificationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }

    public String getTitleSi() { return titleSi; }
    public void setTitleSi(String titleSi) { this.titleSi = titleSi; }

    public String getMessageEn() { return messageEn; }
    public void setMessageEn(String messageEn) { this.messageEn = messageEn; }

    public String getMessageSi() { return messageSi; }
    public void setMessageSi(String messageSi) { this.messageSi = messageSi; }

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
