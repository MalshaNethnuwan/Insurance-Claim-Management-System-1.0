package com.insurance.claim.repository;

import com.insurance.claim.entity.Claim;
import com.insurance.claim.entity.ClaimStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimStatusHistoryRepository extends JpaRepository<ClaimStatusHistory, Long> {
    List<ClaimStatusHistory> findByClaimOrderByCreatedAtAsc(Claim claim);
}
