package com.bank.callmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CallMonitoringFilter {

    private String keyword;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startPeriod;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endPeriod;

    private SentimentCategory sentimentCategory;

    private String sortBy;
    private String sortDir;
}
