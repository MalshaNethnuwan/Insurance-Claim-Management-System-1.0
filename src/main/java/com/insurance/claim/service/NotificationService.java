package com.insurance.claim.service;

import com.insurance.claim.dto.NotificationDto;
import com.insurance.claim.entity.Claim;
import com.insurance.claim.entity.Notification;
import com.insurance.claim.entity.User;
import com.insurance.claim.repository.NotificationRepository;
import com.insurance.claim.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void markAsRead(Long id, String userId) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + id));
        if (n.getUser() != null && n.getUser().getUserId().equals(userId)) {
            n.setRead(true);
            notificationRepository.save(n);
        }
    }

    @Transactional
    public void markAllAsRead(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        for (Notification n : notifications) {
            n.setRead(true);
        }
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void sendNotification(User recipient, String titleEn, String titleSi, String messageEn, String messageSi, Claim claim) {
        if (recipient == null) return;
        Notification n = new Notification();
        n.setUser(recipient);
        n.setTitleEn(titleEn);
        n.setTitleSi(titleSi);
        n.setMessageEn(messageEn);
        n.setMessageSi(messageSi);
        n.setClaim(claim);
        n.setRead(false);
        notificationRepository.save(n);
    }

    private NotificationDto mapToDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setUserId(n.getUser() != null ? n.getUser().getId() : null);
        dto.setTitleEn(n.getTitleEn());
        dto.setTitleSi(n.getTitleSi());
        dto.setMessageEn(n.getMessageEn());
        dto.setMessageSi(n.getMessageSi());
        dto.setClaimId(n.getClaim() != null ? n.getClaim().getId() : null);
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
