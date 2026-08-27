package com.bank.callmonitoring.service.impl;

import com.bank.callmonitoring.dto.CallMonitoringFilter;
import com.bank.callmonitoring.dto.CallMonitoringResponse;
import com.bank.callmonitoring.dto.PageInfo;
import com.bank.callmonitoring.dto.PagedResponse;
import com.bank.callmonitoring.entity.CallMonitoring;
import com.bank.callmonitoring.exception.BadRequestException;
import com.bank.callmonitoring.repository.CallMonitoringRepository;
import com.bank.callmonitoring.repository.CallMonitoringSpecification;
import com.bank.callmonitoring.service.CallMonitoringService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

@Service
@Transactional(readOnly = true)
public class CallMonitoringServiceImpl implements CallMonitoringService {

    private static final Map<String, String> ALLOWED_SORT_COLUMNS = Map.ofEntries(
            Map.entry("callid", "callId"),
            Map.entry("call_id", "callId"),
            Map.entry("calltimestamp", "callTimestamp"),
            Map.entry("call_timestamp", "callTimestamp"),
            Map.entry("csname", "csName"),
            Map.entry("cs_name", "csName"),
            Map.entry("customername", "customerName"),
            Map.entry("customer_name", "customerName"),
            Map.entry("sentimentscore", "sentimentScore"),
            Map.entry("sentiment_score", "sentimentScore"),
            Map.entry("id", "id")
    );

    private final CallMonitoringRepository repository;
    private final Clock clock;

    public CallMonitoringServiceImpl(CallMonitoringRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    @Override
    public PagedResponse<CallMonitoringResponse> findAll(CallMonitoringFilter filter, Pageable pageable) {
        validatePeriodFilter(filter);
        Sort sanitizedSort = resolveAndValidateSort(pageable.getSort());

        PageRequest pageRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sanitizedSort);
        Page<CallMonitoring> pageResult = repository.findAll(CallMonitoringSpecification.withFilter(filter), pageRequest);

        List<CallMonitoring> content = pageResult.getContent();
        int currentPage = pageResult.getNumber();
        int pageSize = pageResult.getSize();

        List<CallMonitoringResponse> data = IntStream.range(0, content.size())
                .mapToObj(index -> {
                    CallMonitoring item = content.get(index);
                    long rowNumber = ((long) currentPage * pageSize) + index + 1;
                    return CallMonitoringResponse.builder()
                            .no(rowNumber)
                            .id(item.getId())
                            .callId(item.getCallId())
                            .callTimestamp(item.getCallTimestamp())
                            .csName(item.getCsName())
                            .customerName(item.getCustomerName())
                            .sentimentScore(item.getSentimentScore())
                            .build();
                })
                .toList();

        PageInfo pageInfo = PageInfo.builder()
                .currentPage(pageResult.getNumber())
                .totalPages(pageResult.getTotalPages())
                .totalElements(pageResult.getTotalElements())
                .size(pageResult.getSize())
                .build();

        return PagedResponse.<CallMonitoringResponse>builder()
                .data(data)
                .page(pageInfo)
                .build();
    }

    private void validatePeriodFilter(CallMonitoringFilter filter) {
        if (filter == null) {
            return;
        }

        LocalDate start = filter.getStartPeriod();
        LocalDate end = filter.getEndPeriod();

        if ((start != null && end == null) || (start == null && end != null)) {
            throw new BadRequestException("Both startPeriod and endPeriod must be provided together");
        }

        if (start != null) {
            if (start.isAfter(end)) {
                throw new BadRequestException("startPeriod must not be after endPeriod");
            }

            LocalDate threeMonthsAgo = LocalDate.now(clock).minusMonths(3);
            if (start.isBefore(threeMonthsAgo)) {
                throw new BadRequestException("startPeriod cannot be older than 3 months from today");
            }
            if (end.isBefore(threeMonthsAgo)) {
                throw new BadRequestException("endPeriod cannot be older than 3 months from today");
            }
        }
    }

    private Sort resolveAndValidateSort(Sort sort) {
        if (sort == null || sort.isUnsorted()) {
            return Sort.by(Sort.Direction.DESC, "callTimestamp");
        }

        List<Sort.Order> sanitizedOrders = new ArrayList<>();
        for (Sort.Order order : sort) {
            String propertyKey = order.getProperty().toLowerCase();
            String entityProperty = ALLOWED_SORT_COLUMNS.get(propertyKey);

            if (entityProperty == null) {
                throw new BadRequestException("Invalid sort column: '" + order.getProperty()
                        + "'. Allowed columns: call_id, call_timestamp, cs_name, customer_name, sentiment_score");
            }

            sanitizedOrders.add(new Sort.Order(order.getDirection(), entityProperty));
        }

        return Sort.by(sanitizedOrders);
    }
}
