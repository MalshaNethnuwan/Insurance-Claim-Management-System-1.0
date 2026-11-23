package com.insurance.claim.service;

import com.insurance.claim.dto.OfficerDto;
import com.insurance.claim.entity.AuditLog;
import com.insurance.claim.entity.InsuranceCategory;
import com.insurance.claim.entity.InsuranceOfficer;
import com.insurance.claim.entity.User;
import com.insurance.claim.repository.AuditLogRepository;
import com.insurance.claim.repository.InsuranceCategoryRepository;
import com.insurance.claim.repository.InsuranceOfficerRepository;
import com.insurance.claim.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OfficerService {

    private final InsuranceOfficerRepository officerRepository;
    private final InsuranceCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogRepository auditLogRepository;

    public OfficerService(InsuranceOfficerRepository officerRepository,
                          InsuranceCategoryRepository categoryRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuditLogRepository auditLogRepository) {
        this.officerRepository = officerRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public List<OfficerDto> getAllOfficers() {
        return officerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OfficerDto> searchOfficers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllOfficers();
        }
        return officerRepository.searchOfficers(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OfficerDto getOfficerById(Long id) {
        InsuranceOfficer officer = officerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Officer not found with id: " + id));
        return mapToDto(officer);
    }

    @Transactional(readOnly = true)
    public OfficerDto getOfficerByUserId(String userId) {
        InsuranceOfficer officer = officerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Officer not found for user: " + userId));
        return mapToDto(officer);
    }

    @Transactional
    public OfficerDto createOfficer(OfficerDto dto, String adminUserId) {
        long count = userRepository.findByRole("OFFICER").size();
        String generatedUserId = String.format("OFF%03d", count + 1);
        String employeeId = dto.getEmployeeId() != null && !dto.getEmployeeId().isBlank()
                ? dto.getEmployeeId() : String.format("EMP-%03d", count + 101);

        String initialPassword = dto.getInitialPassword() != null && !dto.getInitialPassword().isBlank()
                ? dto.getInitialPassword() : "Welcome@" + generatedUserId;

        User user = new User();
        user.setUserId(generatedUserId);
        user.setPassword(passwordEncoder.encode(initialPassword));
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhoneNumber());
        user.setRole("OFFICER");
        user.setStatus("ACTIVE");
        user.setMustChangePassword(true);
        user = userRepository.save(user);

        InsuranceOfficer officer = new InsuranceOfficer();
        officer.setUser(user);
        officer.setEmployeeId(employeeId);
        officer.setFullName(dto.getFullName());
        officer.setEmail(dto.getEmail());
        officer.setPhoneNumber(dto.getPhoneNumber());

        if (dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
            List<InsuranceCategory> categories = categoryRepository.findAllById(dto.getCategoryIds());
            officer.setCategories(new HashSet<>(categories));
        }

        officer = officerRepository.save(officer);

        auditLogRepository.save(new AuditLog(adminUserId, "CREATE_OFFICER", "Officer", officer.getId().toString(),
                "Created officer " + officer.getFullName() + " (" + generatedUserId + ")", "127.0.0.1"));

        OfficerDto result = mapToDto(officer);
        result.setInitialPassword(initialPassword);
        return result;
    }

    @Transactional
    public OfficerDto updateOfficer(Long id, OfficerDto dto, String adminUserId) {
        InsuranceOfficer officer = officerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Officer not found with id: " + id));

        officer.setFullName(dto.getFullName());
        officer.setEmail(dto.getEmail());
        officer.setPhoneNumber(dto.getPhoneNumber());
        officer.setUpdatedAt(OffsetDateTime.now());

        if (dto.getCategoryIds() != null) {
            List<InsuranceCategory> categories = categoryRepository.findAllById(dto.getCategoryIds());
            officer.setCategories(new HashSet<>(categories));
        }

        User user = officer.getUser();
        if (user != null) {
            user.setEmail(dto.getEmail());
            user.setPhone(dto.getPhoneNumber());
            user.setUpdatedAt(OffsetDateTime.now());
            userRepository.save(user);
        }

        officer = officerRepository.save(officer);

        auditLogRepository.save(new AuditLog(adminUserId, "UPDATE_OFFICER", "Officer", officer.getId().toString(),
                "Updated details for officer " + officer.getFullName(), "127.0.0.1"));

        return mapToDto(officer);
    }

    @Transactional
    public OfficerDto toggleOfficerStatus(Long id, String adminUserId) {
        InsuranceOfficer officer = officerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Officer not found with id: " + id));

        User user = officer.getUser();
        if (user != null) {
            String newStatus = "ACTIVE".equalsIgnoreCase(user.getStatus()) ? "INACTIVE" : "ACTIVE";
            user.setStatus(newStatus);
            user.setUpdatedAt(OffsetDateTime.now());
            userRepository.save(user);

            auditLogRepository.save(new AuditLog(adminUserId, "TOGGLE_OFFICER_STATUS", "Officer", officer.getId().toString(),
                    "Changed status to " + newStatus + " for " + officer.getFullName(), "127.0.0.1"));
        }

        return mapToDto(officer);
    }

    public OfficerDto mapToDto(InsuranceOfficer o) {
        OfficerDto dto = new OfficerDto();
        dto.setId(o.getId());
        dto.setUserId(o.getUser() != null ? o.getUser().getUserId() : null);
        dto.setEmployeeId(o.getEmployeeId());
        dto.setFullName(o.getFullName());
        dto.setEmail(o.getEmail());
        dto.setPhoneNumber(o.getPhoneNumber());
        dto.setStatus(o.getUser() != null ? o.getUser().getStatus() : "ACTIVE");
        dto.setCreatedAt(o.getCreatedAt());

        if (o.getCategories() != null) {
            dto.setCategoryIds(o.getCategories().stream().map(InsuranceCategory::getId).collect(Collectors.toList()));
            dto.setCategoryNames(o.getCategories().stream().map(InsuranceCategory::getNameEn).collect(Collectors.toList()));
        }
        return dto;
    }
}
