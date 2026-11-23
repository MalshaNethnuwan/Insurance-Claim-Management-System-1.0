package com.insurance.claim.service;

import com.insurance.claim.dto.CustomerDto;
import com.insurance.claim.entity.AuditLog;
import com.insurance.claim.entity.Customer;
import com.insurance.claim.entity.User;
import com.insurance.claim.repository.AuditLogRepository;
import com.insurance.claim.repository.CustomerRepository;
import com.insurance.claim.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogRepository auditLogRepository;

    public CustomerService(CustomerRepository customerRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuditLogRepository auditLogRepository) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CustomerDto> searchCustomers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllCustomers();
        }
        return customerRepository.searchCustomers(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));
        return mapToDto(customer);
    }

    @Transactional(readOnly = true)
    public CustomerDto getCustomerByUserId(String userId) {
        Customer customer = customerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found for user: " + userId));
        return mapToDto(customer);
    }

    @Transactional
    public CustomerDto createCustomer(CustomerDto dto, String adminUserId) {
        if (customerRepository.existsByNicNumber(dto.getNicNumber())) {
            throw new IllegalArgumentException("Customer with NIC number " + dto.getNicNumber() + " already exists");
        }

        long count = userRepository.findByRole("CUSTOMER").size();
        String generatedUserId = String.format("CUS%03d", count + 1);
        String initialPassword = dto.getInitialPassword() != null && !dto.getInitialPassword().isBlank()
                ? dto.getInitialPassword() : "Welcome@" + generatedUserId;

        User user = new User();
        user.setUserId(generatedUserId);
        user.setPassword(passwordEncoder.encode(initialPassword));
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhoneNumber());
        user.setRole("CUSTOMER");
        user.setStatus("ACTIVE");
        user.setMustChangePassword(true);
        user = userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(user);
        customer.setCustomerCode(String.format("CUST-%03d", count + 1));
        customer.setFullName(dto.getFullName());
        customer.setNicNumber(dto.getNicNumber());
        customer.setEmail(dto.getEmail());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setAddress(dto.getAddress());
        customer.setDateOfBirth(dto.getDateOfBirth());
        customer = customerRepository.save(customer);

        auditLogRepository.save(new AuditLog(adminUserId, "CREATE_CUSTOMER", "Customer", customer.getId().toString(),
                "Created customer " + customer.getFullName() + " (" + generatedUserId + ")", "127.0.0.1"));

        CustomerDto result = mapToDto(customer);
        result.setInitialPassword(initialPassword);
        return result;
    }

    @Transactional
    public CustomerDto updateCustomer(Long id, CustomerDto dto, String adminUserId) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));

        customer.setFullName(dto.getFullName());
        customer.setEmail(dto.getEmail());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setAddress(dto.getAddress());
        customer.setDateOfBirth(dto.getDateOfBirth());
        customer.setUpdatedAt(OffsetDateTime.now());

        User user = customer.getUser();
        if (user != null) {
            user.setEmail(dto.getEmail());
            user.setPhone(dto.getPhoneNumber());
            user.setUpdatedAt(OffsetDateTime.now());
            userRepository.save(user);
        }

        customer = customerRepository.save(customer);

        auditLogRepository.save(new AuditLog(adminUserId, "UPDATE_CUSTOMER", "Customer", customer.getId().toString(),
                "Updated details for customer " + customer.getFullName(), "127.0.0.1"));

        return mapToDto(customer);
    }

    @Transactional
    public CustomerDto toggleCustomerStatus(Long id, String adminUserId) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));

        User user = customer.getUser();
        if (user != null) {
            String newStatus = "ACTIVE".equalsIgnoreCase(user.getStatus()) ? "INACTIVE" : "ACTIVE";
            user.setStatus(newStatus);
            user.setUpdatedAt(OffsetDateTime.now());
            userRepository.save(user);

            auditLogRepository.save(new AuditLog(adminUserId, "TOGGLE_CUSTOMER_STATUS", "Customer", customer.getId().toString(),
                    "Changed status to " + newStatus + " for " + customer.getFullName(), "127.0.0.1"));
        }

        return mapToDto(customer);
    }

    public CustomerDto mapToDto(Customer c) {
        CustomerDto dto = new CustomerDto();
        dto.setId(c.getId());
        dto.setUserId(c.getUser() != null ? c.getUser().getUserId() : null);
        dto.setCustomerCode(c.getCustomerCode());
        dto.setFullName(c.getFullName());
        dto.setNicNumber(c.getNicNumber());
        dto.setEmail(c.getEmail());
        dto.setPhoneNumber(c.getPhoneNumber());
        dto.setAddress(c.getAddress());
        dto.setDateOfBirth(c.getDateOfBirth());
        dto.setStatus(c.getUser() != null ? c.getUser().getStatus() : "ACTIVE");
        dto.setCreatedAt(c.getCreatedAt());
        return dto;
    }
}
