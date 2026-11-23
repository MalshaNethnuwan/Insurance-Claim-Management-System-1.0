package com.insurance.claim.repository;

import com.insurance.claim.entity.Customer;
import com.insurance.claim.entity.InsuranceCategory;
import com.insurance.claim.entity.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {
    Optional<InsurancePolicy> findByPolicyNumber(String policyNumber);
    boolean existsByPolicyNumber(String policyNumber);
    List<InsurancePolicy> findByCustomer(Customer customer);
    List<InsurancePolicy> findByCustomerAndStatus(Customer customer, String status);
    List<InsurancePolicy> findByCategory(InsuranceCategory category);

    @Query("SELECT p FROM InsurancePolicy p WHERE " +
           "LOWER(p.policyNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.policyNameEn) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.customer.fullName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<InsurancePolicy> searchPolicies(@Param("query") String query);
}
