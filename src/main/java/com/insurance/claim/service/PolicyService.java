package com.insurance.claim.service;

import com.insurance.claim.dto.PolicyDto;
import com.insurance.claim.entity.Customer;
import com.insurance.claim.entity.InsuranceCategory;
import com.insurance.claim.entity.InsurancePolicy;
import com.insurance.claim.repository.CustomerRepository;
import com.insurance.claim.repository.InsuranceCategoryRepository;
import com.insurance.claim.repository.InsurancePolicyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PolicyService {

    private final InsurancePolicyRepository policyRepository;
    private final CustomerRepository customerRepository;
    private final InsuranceCategoryRepository categoryRepository;

    public PolicyService(InsurancePolicyRepository policyRepository,
                         CustomerRepository customerRepository,
                         InsuranceCategoryRepository categoryRepository) {
        this.policyRepository = policyRepository;
        this.customerRepository = customerRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<PolicyDto> getAllPolicies() {
        return policyRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PolicyDto> getPoliciesByCustomerId(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + customerId));
        return policyRepository.findByCustomer(customer).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PolicyDto> getActivePoliciesByUserId(String userId) {
        Customer customer = customerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found for user: " + userId));
        return policyRepository.findByCustomerAndStatus(customer, "ACTIVE").stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PolicyDto> getAllPoliciesByUserId(String userId) {
        Customer customer = customerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found for user: " + userId));
        return policyRepository.findByCustomer(customer).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PolicyDto getPolicyById(Long id) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found with id: " + id));
        return mapToDto(policy);
    }

    @Transactional(readOnly = true)
    public List<PolicyDto> searchPolicies(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllPolicies();
        }
        return policyRepository.searchPolicies(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PolicyDto createPolicy(PolicyDto dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + dto.getCustomerId()));

        InsuranceCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + dto.getCategoryId()));

        String policyNumber = dto.getPolicyNumber();
        if (policyNumber == null || policyNumber.isBlank()) {
            policyNumber = "POL-" + category.getCode().substring(0, Math.min(3, category.getCode().length())) + "-" + (1000 + (int)(Math.random() * 9000));
        }

        InsurancePolicy policy = new InsurancePolicy();
        policy.setPolicyNumber(policyNumber);
        policy.setPolicyNameEn(dto.getPolicyNameEn());
        policy.setPolicyNameSi(dto.getPolicyNameSi() != null ? dto.getPolicyNameSi() : dto.getPolicyNameEn());
        policy.setCategory(category);
        policy.setCustomer(customer);
        policy.setCoverageAmount(dto.getCoverageAmount());
        policy.setPremiumAmount(dto.getPremiumAmount());
        policy.setStartDate(dto.getStartDate());
        policy.setExpiryDate(dto.getExpiryDate());
        policy.setStatus("ACTIVE");

        policy = policyRepository.save(policy);
        return mapToDto(policy);
    }

    @Transactional
    public PolicyDto updatePolicy(Long id, PolicyDto dto) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found with id: " + id));

        policy.setPolicyNameEn(dto.getPolicyNameEn());
        if (dto.getPolicyNameSi() != null) {
            policy.setPolicyNameSi(dto.getPolicyNameSi());
        }
        policy.setCoverageAmount(dto.getCoverageAmount());
        policy.setPremiumAmount(dto.getPremiumAmount());
        policy.setStartDate(dto.getStartDate());
        policy.setExpiryDate(dto.getExpiryDate());
        if (dto.getStatus() != null) {
            policy.setStatus(dto.getStatus());
        }
        policy.setUpdatedAt(OffsetDateTime.now());

        policy = policyRepository.save(policy);
        return mapToDto(policy);
    }

    @Transactional
    public PolicyDto togglePolicyStatus(Long id) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found with id: " + id));

        String newStatus = "ACTIVE".equalsIgnoreCase(policy.getStatus()) ? "CANCELLED" : "ACTIVE";
        policy.setStatus(newStatus);
        policy.setUpdatedAt(OffsetDateTime.now());
        policy = policyRepository.save(policy);
        return mapToDto(policy);
    }

    public PolicyDto mapToDto(InsurancePolicy p) {
        PolicyDto dto = new PolicyDto();
        dto.setId(p.getId());
        dto.setPolicyNumber(p.getPolicyNumber());
        dto.setPolicyNameEn(p.getPolicyNameEn());
        dto.setPolicyNameSi(p.getPolicyNameSi());
        dto.setCategoryId(p.getCategory() != null ? p.getCategory().getId() : null);
        dto.setCategoryCode(p.getCategory() != null ? p.getCategory().getCode() : null);
        dto.setCategoryNameEn(p.getCategory() != null ? p.getCategory().getNameEn() : null);
        dto.setCategoryNameSi(p.getCategory() != null ? p.getCategory().getNameSi() : null);
        dto.setCustomerId(p.getCustomer() != null ? p.getCustomer().getId() : null);
        dto.setCustomerName(p.getCustomer() != null ? p.getCustomer().getFullName() : null);
        dto.setCustomerCode(p.getCustomer() != null ? p.getCustomer().getCustomerCode() : null);
        dto.setCoverageAmount(p.getCoverageAmount());
        dto.setPremiumAmount(p.getPremiumAmount());
        dto.setStartDate(p.getStartDate());
        dto.setExpiryDate(p.getExpiryDate());
        dto.setStatus(p.getStatus());
        return dto;
    }
}
