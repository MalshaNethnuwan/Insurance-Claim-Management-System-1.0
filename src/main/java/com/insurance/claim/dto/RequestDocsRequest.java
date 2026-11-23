package com.insurance.claim.dto;

import jakarta.validation.constraints.NotBlank;

public class RequestDocsRequest {
    @NotBlank(message = "Document request instructions are required")
    private String documentRequestNotes;

    public RequestDocsRequest() {}
    public RequestDocsRequest(String documentRequestNotes) {
        this.documentRequestNotes = documentRequestNotes;
    }

    public String getDocumentRequestNotes() { return documentRequestNotes; }
    public void setDocumentRequestNotes(String documentRequestNotes) { this.documentRequestNotes = documentRequestNotes; }
}
