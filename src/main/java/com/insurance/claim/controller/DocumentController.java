package com.insurance.claim.controller;

import com.insurance.claim.dto.ClaimDocumentDto;
import com.insurance.claim.entity.ClaimDocument;
import com.insurance.claim.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ClaimDocumentDto> uploadDocument(
            @RequestParam("claimId") Long claimId,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "isAdditional", defaultValue = "false") boolean isAdditional,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        ClaimDocumentDto dto = documentService.uploadDocument(claimId, documentType, isAdditional, file, authentication.getName());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long id,
            Authentication authentication) {
        ClaimDocument doc = documentService.getDocumentEntity(id, authentication.getName());
        Resource resource = documentService.loadFileAsResource(id, authentication.getName());

        String contentType = doc.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getDocumentName() + "\"")
                .body(resource);
    }
}
