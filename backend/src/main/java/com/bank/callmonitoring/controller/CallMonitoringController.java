package com.bank.callmonitoring.controller;

import com.bank.callmonitoring.dto.CallMonitoringFilter;
import com.bank.callmonitoring.dto.CallMonitoringResponse;
import com.bank.callmonitoring.dto.PagedResponse;
import com.bank.callmonitoring.service.CallMonitoringService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/call-monitoring")
public class CallMonitoringController {

    private final CallMonitoringService service;

    public CallMonitoringController(CallMonitoringService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<CallMonitoringResponse>> getCallMonitoringList(
            CallMonitoringFilter filter,
            @PageableDefault(page = 0, size = 5, sort = "call_timestamp", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Pageable effectivePageable = resolveEffectivePageable(filter, pageable);
        return ResponseEntity.ok(service.findAll(filter, effectivePageable));
    }

    private Pageable resolveEffectivePageable(CallMonitoringFilter filter, Pageable pageable) {
        if (filter != null && StringUtils.hasText(filter.getSortBy())) {
            Sort.Direction direction = "asc".equalsIgnoreCase(filter.getSortDir())
                    ? Sort.Direction.ASC
                    : Sort.Direction.DESC;
            Sort customSort = Sort.by(direction, filter.getSortBy());
            return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), customSort);
        }
        return pageable;
    }
}
