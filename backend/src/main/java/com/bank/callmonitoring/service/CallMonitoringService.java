package com.bank.callmonitoring.service;

import com.bank.callmonitoring.dto.CallMonitoringFilter;
import com.bank.callmonitoring.dto.CallMonitoringResponse;
import com.bank.callmonitoring.dto.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface CallMonitoringService {

    PagedResponse<CallMonitoringResponse> findAll(CallMonitoringFilter filter, Pageable pageable);
}
