package com.insurance.claim.repository;

import com.insurance.claim.entity.InsuranceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface InsuranceCategoryRepository extends JpaRepository<InsuranceCategory, Long> {
    Optional<InsuranceCategory> findByCode(String code);
    boolean existsByCode(String code);
    List<InsuranceCategory> findByIsActiveTrue();
}
