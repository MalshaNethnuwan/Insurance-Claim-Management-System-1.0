package com.insurance.claim.service;

import com.insurance.claim.dto.CategoryDto;
import com.insurance.claim.entity.InsuranceCategory;
import com.insurance.claim.repository.InsuranceCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final InsuranceCategoryRepository categoryRepository;

    public CategoryService(InsuranceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        InsuranceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
        return mapToDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByCode(dto.getCode().toUpperCase())) {
            throw new IllegalArgumentException("Category with code " + dto.getCode() + " already exists");
        }

        InsuranceCategory cat = new InsuranceCategory();
        cat.setCode(dto.getCode().toUpperCase().trim());
        cat.setNameEn(dto.getNameEn());
        cat.setNameSi(dto.getNameSi());
        cat.setDescriptionEn(dto.getDescriptionEn());
        cat.setDescriptionSi(dto.getDescriptionSi());
        cat.setRequiredDocuments(dto.getRequiredDocuments());
        cat.setClaimTypes(dto.getClaimTypes());
        cat.setActive(dto.isActive());
        cat = categoryRepository.save(cat);
        return mapToDto(cat);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        InsuranceCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));

        cat.setNameEn(dto.getNameEn());
        cat.setNameSi(dto.getNameSi());
        cat.setDescriptionEn(dto.getDescriptionEn());
        cat.setDescriptionSi(dto.getDescriptionSi());
        cat.setRequiredDocuments(dto.getRequiredDocuments());
        cat.setClaimTypes(dto.getClaimTypes());
        cat.setActive(dto.isActive());
        cat.setUpdatedAt(OffsetDateTime.now());

        cat = categoryRepository.save(cat);
        return mapToDto(cat);
    }

    @Transactional
    public CategoryDto toggleCategoryStatus(Long id) {
        InsuranceCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));

        cat.setActive(!cat.isActive());
        cat.setUpdatedAt(OffsetDateTime.now());
        cat = categoryRepository.save(cat);
        return mapToDto(cat);
    }

    public CategoryDto mapToDto(InsuranceCategory c) {
        CategoryDto dto = new CategoryDto();
        dto.setId(c.getId());
        dto.setCode(c.getCode());
        dto.setNameEn(c.getNameEn());
        dto.setNameSi(c.getNameSi());
        dto.setDescriptionEn(c.getDescriptionEn());
        dto.setDescriptionSi(c.getDescriptionSi());
        dto.setRequiredDocuments(c.getRequiredDocuments());
        dto.setClaimTypes(c.getClaimTypes());
        dto.setActive(c.isActive());
        return dto;
    }
}
