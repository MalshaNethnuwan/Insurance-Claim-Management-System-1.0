package com.insurance.claim.repository;

import com.insurance.claim.entity.Claim;
import com.insurance.claim.entity.ClaimDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimDocumentRepository extends JpaRepository<ClaimDocument, Long> {
    List<ClaimDocument> findByClaimOrderByUploadedAtDesc(Claim claim);
}
