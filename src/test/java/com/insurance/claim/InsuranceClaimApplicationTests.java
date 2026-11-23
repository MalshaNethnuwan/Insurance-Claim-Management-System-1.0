package com.insurance.claim;

import com.insurance.claim.dto.AuthRequest;
import com.insurance.claim.dto.AuthResponse;
import com.insurance.claim.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class InsuranceClaimApplicationTests {

    @Autowired
    private AuthService authService;

    @Test
    void testAdminLoginSuccess() {
        AuthRequest req = new AuthRequest("ADM001", "Password123!");
        AuthResponse res = authService.login(req);
        assertNotNull(res);
        assertNotNull(res.getToken());
        assertEquals("ADMIN", res.getRole());
    }

    @Test
    void testOfficerLoginSuccess() {
        AuthRequest req = new AuthRequest("OFF001", "Password123!");
        AuthResponse res = authService.login(req);
        assertNotNull(res);
        assertEquals("OFFICER", res.getRole());
    }

    @Test
    void testCustomerLoginSuccess() {
        AuthRequest req = new AuthRequest("CUS001", "Password123!");
        AuthResponse res = authService.login(req);
        assertNotNull(res);
        assertEquals("CUSTOMER", res.getRole());
    }
}
