package com.bank.callmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CallMonitoringFilter {

    private String keyword;
    private LocalDate startPeriod;
    private LocalDate endPeriod;
    private SentimentCategory sentimentCategory;
}
