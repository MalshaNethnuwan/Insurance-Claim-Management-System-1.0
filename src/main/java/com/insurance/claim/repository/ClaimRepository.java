package com.insurance.claim.repository;

import com.insurance.claim.entity.Claim;
import com.insurance.claim.entity.Customer;
import com.insurance.claim.entity.InsuranceCategory;
import com.insurance.claim.entity.InsuranceOfficer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    Optional<Claim> findByClaimReference(String claimReference);
    boolean existsByClaimReference(String claimReference);

    List<Claim> findByCustomerOrderByCreatedAtDesc(Customer customer);
    List<Claim> findByCustomerAndStatusOrderByCreatedAtDesc(Customer customer, String status);

    List<Claim> findByAssignedOfficerOrderByCreatedAtDesc(InsuranceOfficer officer);

    @Query("SELECT c FROM Claim c WHERE c.assignedOfficer = :officer OR c.category IN :categories ORDER BY c.createdAt DESC")
    List<Claim> findByOfficerOrCategoriesOrderByCreatedAtDesc(@Param("officer") InsuranceOfficer officer, @Param("categories") Collection<InsuranceCategory> categories);

    List<Claim> findByStatusOrderByCreatedAtDesc(String status);
    List<Claim> findByCategoryOrderByCreatedAtDesc(InsuranceCategory category);

    @Query("SELECT c FROM Claim c WHERE " +
           "LOWER(c.claimReference) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.customer.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.policy.policyNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Claim> searchClaims(@Param("query") String query);

    long countByStatus(String status);
    long countByCategory(InsuranceCategory category);
}
