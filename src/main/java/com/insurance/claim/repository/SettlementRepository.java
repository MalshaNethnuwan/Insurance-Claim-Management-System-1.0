package com.insurance.claim.repository;

import com.insurance.claim.entity.Claim;
import com.insurance.claim.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {
    Optional<Settlement> findByClaim(Claim claim);
}
