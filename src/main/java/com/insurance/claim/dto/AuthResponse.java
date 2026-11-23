package com.insurance.claim.dto;

public class AuthResponse {
    private String token;
    private String userId;
    private String fullName;
    private String role;
    private boolean mustChangePassword;
    private Long entityId;

    public AuthResponse() {}
    public AuthResponse(String token, String userId, String fullName, String role, boolean mustChangePassword, Long entityId) {
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.role = role;
        this.mustChangePassword = mustChangePassword;
        this.entityId = entityId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isMustChangePassword() { return mustChangePassword; }
    public void setMustChangePassword(boolean mustChangePassword) { this.mustChangePassword = mustChangePassword; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
}
