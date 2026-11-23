package com.insurance.claim.service;

import com.insurance.claim.dto.ClaimDocumentDto;
import com.insurance.claim.entity.*;
import com.insurance.claim.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    private final Path uploadLocation;
    private final ClaimDocumentRepository documentRepository;
    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;
    private final InsuranceOfficerRepository officerRepository;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "jpg", "jpeg", "png");
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "application/pdf", "image/jpeg", "image/png"
    );

    public DocumentService(@Value("${app.upload.dir:./uploads/documents}") String uploadDir,
                           ClaimDocumentRepository documentRepository,
                           ClaimRepository claimRepository,
                           UserRepository userRepository,
                           InsuranceOfficerRepository officerRepository) {
        this.uploadLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.documentRepository = documentRepository;
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
        this.officerRepository = officerRepository;

        try {
            Files.createDirectories(this.uploadLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @Transactional
    public ClaimDocumentDto uploadDocument(Long claimId, String documentType, boolean isAdditional,
                                           MultipartFile file, String userId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with id: " + claimId));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // Validate access
        validateClaimAccess(claim, user);

        // Validate file
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("File name is invalid");
        }

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Unsupported file type. Only PDF, JPG, JPEG, and PNG files are allowed.");
        }

        String storedFileName = UUID.randomUUID().toString() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
        Path targetLocation = this.uploadLocation.resolve(storedFileName);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + originalFilename, e);
        }

        ClaimDocument document = new ClaimDocument();
        document.setClaim(claim);
        document.setDocumentName(originalFilename);
        document.setDocumentType(documentType);
        document.setFilePath(storedFileName);
        document.setFileSize(file.getSize());
        document.setContentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        document.setAdditionalRequest(isAdditional);
        document.setUploadedBy(user);

        document = documentRepository.save(document);
        return mapToDto(document);
    }

    @Transactional(readOnly = true)
    public Resource loadFileAsResource(Long documentId, String userId) {
        ClaimDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + documentId));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        validateClaimAccess(doc.getClaim(), user);

        try {
            Path filePath = this.uploadLocation.resolve(doc.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                // In development/seed data, if physical file doesn't exist yet, return sample content or create dummy
                if (!Files.exists(filePath)) {
                    Files.writeString(filePath, "Sample document content for " + doc.getDocumentName());
                    return new UrlResource(filePath.toUri());
                }
                throw new RuntimeException("File not found or not readable: " + doc.getDocumentName());
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("File path is invalid", e);
        } catch (IOException e) {
            throw new RuntimeException("Error accessing file", e);
        }
    }

    @Transactional(readOnly = true)
    public ClaimDocument getDocumentEntity(Long documentId, String userId) {
        ClaimDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + documentId));

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        validateClaimAccess(doc.getClaim(), user);
        return doc;
    }

    private void validateClaimAccess(Claim claim, User user) {
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return;
        }

        if ("CUSTOMER".equalsIgnoreCase(user.getRole())) {
            if (claim.getCustomer() == null || claim.getCustomer().getUser() == null ||
                !claim.getCustomer().getUser().getUserId().equals(user.getUserId())) {
                throw new AccessDeniedException("You are not authorized to access this claim's documents");
            }
            return;
        }

        if ("OFFICER".equalsIgnoreCase(user.getRole())) {
            InsuranceOfficer officer = officerRepository.findByUser_UserId(user.getUserId()).orElse(null);
            if (officer == null) {
                throw new AccessDeniedException("Officer profile not found");
            }

            boolean isAssigned = claim.getAssignedOfficer() != null &&
                    claim.getAssignedOfficer().getId().equals(officer.getId());

            boolean isCategoryAuthorized = officer.getCategories() != null &&
                    officer.getCategories().stream().anyMatch(cat -> cat.getId().equals(claim.getCategory().getId()));

            if (!isAssigned && !isCategoryAuthorized) {
                throw new AccessDeniedException("You are not authorized to access claims outside your assigned categories");
            }
        }
    }

    public ClaimDocumentDto mapToDto(ClaimDocument doc) {
        ClaimDocumentDto dto = new ClaimDocumentDto();
        dto.setId(doc.getId());
        dto.setClaimId(doc.getClaim() != null ? doc.getClaim().getId() : null);
        dto.setDocumentName(doc.getDocumentName());
        dto.setDocumentType(doc.getDocumentType());
        dto.setFileSize(doc.getFileSize());
        dto.setContentType(doc.getContentType());
        dto.setAdditionalRequest(doc.isAdditionalRequest());
        dto.setUploadedByName(doc.getUploadedBy() != null ? doc.getUploadedBy().getUserId() : null);
        dto.setUploadedAt(doc.getUploadedAt());
        return dto;
    }
}
