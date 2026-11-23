package com.insurance.claim.repository;

import com.insurance.claim.entity.Customer;
import com.insurance.claim.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUser(User user);
    Optional<Customer> findByUser_UserId(String userId);
    Optional<Customer> findByCustomerCode(String customerCode);
    Optional<Customer> findByNicNumber(String nicNumber);
    boolean existsByNicNumber(String nicNumber);
    boolean existsByCustomerCode(String customerCode);

    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.customerCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.nicNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Customer> searchCustomers(@Param("query") String query);
}
