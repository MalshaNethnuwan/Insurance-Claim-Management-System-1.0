package com.insurance.claim.repository;

import com.insurance.claim.entity.InsuranceCategory;
import com.insurance.claim.entity.InsuranceOfficer;
import com.insurance.claim.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface InsuranceOfficerRepository extends JpaRepository<InsuranceOfficer, Long> {
    Optional<InsuranceOfficer> findByUser(User user);
    Optional<InsuranceOfficer> findByUser_UserId(String userId);
    Optional<InsuranceOfficer> findByEmployeeId(String employeeId);
    boolean existsByEmployeeId(String employeeId);

    @Query("SELECT o FROM InsuranceOfficer o JOIN o.categories c WHERE c = :category")
    List<InsuranceOfficer> findByCategory(@Param("category") InsuranceCategory category);

    @Query("SELECT o FROM InsuranceOfficer o WHERE " +
           "LOWER(o.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(o.employeeId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(o.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<InsuranceOfficer> searchOfficers(@Param("query") String query);
}
