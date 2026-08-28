package com.bank.callmonitoring.service;

import com.bank.callmonitoring.dto.CallMonitoringFilter;
import com.bank.callmonitoring.dto.CallMonitoringResponse;
import com.bank.callmonitoring.dto.PagedResponse;
import com.bank.callmonitoring.dto.SentimentCategory;
import com.bank.callmonitoring.entity.CallMonitoring;
import com.bank.callmonitoring.exception.BadRequestException;
import com.bank.callmonitoring.repository.CallMonitoringRepository;
import com.bank.callmonitoring.service.impl.CallMonitoringServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CallMonitoringServiceTest {

    @Mock
    private CallMonitoringRepository repository;

    private CallMonitoringService service;

    private final Clock fixedClock = Clock.fixed(Instant.parse("2026-08-27T00:00:00Z"), ZoneOffset.UTC);

    @BeforeEach
    void setUp() {
        service = new CallMonitoringServiceImpl(repository, fixedClock);
    }

    @Test
    void findAll_WithDefaultParams_ShouldReturnPagedResponseAndCorrectRowNumbers() {
        CallMonitoring item1 = CallMonitoring.builder()
                .id(1L)
                .callId("CALL-20260801-001")
                .callTimestamp(OffsetDateTime.parse("2026-08-01T10:00:00Z"))
                .csName("Budi Santoso")
                .customerName("Agus Pratama")
                .sentimentScore(85)
                .build();

        CallMonitoring item2 = CallMonitoring.builder()
                .id(2L)
                .callId("CALL-20260801-002")
                .callTimestamp(OffsetDateTime.parse("2026-08-01T11:00:00Z"))
                .csName("Siti Rahmawati")
                .customerName("Sri Wahyuni")
                .sentimentScore(65)
                .build();

        Pageable pageable = PageRequest.of(0, 5);
        Page<CallMonitoring> mockPage = new PageImpl<>(List.of(item1, item2), pageable, 2);

        when(repository.findAll(ArgumentMatchers.<Specification<CallMonitoring>>any(), ArgumentMatchers.any(Pageable.class)))
                .thenReturn(mockPage);

        PagedResponse<CallMonitoringResponse> response = service.findAll(new CallMonitoringFilter(), pageable);

        assertNotNull(response);
        assertEquals(2, response.getData().size());
        assertEquals(1L, response.getData().get(0).getNo());
        assertEquals("CALL-20260801-001", response.getData().get(0).getCallId());
        assertEquals(2L, response.getData().get(1).getNo());
        assertEquals(0, response.getPage().getCurrentPage());
        assertEquals(2L, response.getPage().getTotalElements());
    }

    @Test
    void findAll_OnSecondPage_ShouldCalculateRowNumbersStartingFrom6() {
        CallMonitoring item = CallMonitoring.builder()
                .id(6L)
                .callId("CALL-20260801-006")
                .callTimestamp(OffsetDateTime.parse("2026-08-01T15:00:00Z"))
                .csName("Budi Santoso")
                .customerName("Aditya")
                .sentimentScore(90)
                .build();

        Pageable pageable = PageRequest.of(1, 5);
        Page<CallMonitoring> mockPage = new PageImpl<>(List.of(item), pageable, 6);

        when(repository.findAll(ArgumentMatchers.<Specification<CallMonitoring>>any(), ArgumentMatchers.any(Pageable.class)))
                .thenReturn(mockPage);

        PagedResponse<CallMonitoringResponse> response = service.findAll(new CallMonitoringFilter(), pageable);

        assertNotNull(response);
        assertEquals(1, response.getData().size());
        assertEquals(6L, response.getData().get(0).getNo());
        assertEquals(1, response.getPage().getCurrentPage());
    }

    @Test
    void findAll_WithValidPeriod_ShouldPassValidation() {
        CallMonitoringFilter filter = CallMonitoringFilter.builder()
                .startPeriod(LocalDate.of(2026, 6, 1))
                .endPeriod(LocalDate.of(2026, 8, 27))
                .build();

        Pageable pageable = PageRequest.of(0, 5);
        Page<CallMonitoring> mockPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(repository.findAll(ArgumentMatchers.<Specification<CallMonitoring>>any(), ArgumentMatchers.any(Pageable.class)))
                .thenReturn(mockPage);

        PagedResponse<CallMonitoringResponse> response = service.findAll(filter, pageable);

        assertNotNull(response);
        assertTrue(response.getData().isEmpty());
    }

    @Test
    void findAll_WhenStartPeriodAfterEndPeriod_ShouldThrowBadRequestException() {
        CallMonitoringFilter filter = CallMonitoringFilter.builder()
                .startPeriod(LocalDate.of(2026, 8, 20))
                .endPeriod(LocalDate.of(2026, 8, 10))
                .build();

        Pageable pageable = PageRequest.of(0, 5);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.findAll(filter, pageable));
        assertEquals("startPeriod must not be after endPeriod", ex.getMessage());
    }

    @Test
    void findAll_WhenPeriodOlderThan3Months_ShouldThrowBadRequestException() {
        CallMonitoringFilter filter = CallMonitoringFilter.builder()
                .startPeriod(LocalDate.of(2026, 1, 1))
                .endPeriod(LocalDate.of(2026, 1, 31))
                .build();

        Pageable pageable = PageRequest.of(0, 5);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.findAll(filter, pageable));
        assertEquals("startPeriod cannot be older than 3 months from today", ex.getMessage());
    }

    @Test
    void findAll_WhenOnlyOnePeriodDateProvided_ShouldThrowBadRequestException() {
        CallMonitoringFilter filter = CallMonitoringFilter.builder()
                .startPeriod(LocalDate.of(2026, 8, 1))
                .endPeriod(null)
                .build();

        Pageable pageable = PageRequest.of(0, 5);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.findAll(filter, pageable));
        assertEquals("Both startPeriod and endPeriod must be provided together", ex.getMessage());
    }

    @Test
    void findAll_WhenInvalidSortColumn_ShouldThrowBadRequestException() {
        Pageable pageable = PageRequest.of(0, 5, Sort.by("passwordHash"));

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> service.findAll(new CallMonitoringFilter(), pageable));
        assertTrue(ex.getMessage().contains("Invalid sort column: 'passwordHash'"));
    }

    @Test
    void findAll_WhenNoRecordsFound_ShouldReturnEmptyPagedResponse() {
        Pageable pageable = PageRequest.of(0, 5);
        Page<CallMonitoring> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(repository.findAll(ArgumentMatchers.<Specification<CallMonitoring>>any(), ArgumentMatchers.any(Pageable.class)))
                .thenReturn(emptyPage);

        PagedResponse<CallMonitoringResponse> response = service.findAll(new CallMonitoringFilter(), pageable);

        assertNotNull(response);
        assertTrue(response.getData().isEmpty());
        assertEquals(0, response.getPage().getTotalElements());
        assertEquals(0, response.getPage().getTotalPages());
    }
}
