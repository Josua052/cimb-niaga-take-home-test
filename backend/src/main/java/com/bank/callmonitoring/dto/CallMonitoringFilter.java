package com.bank.callmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CallMonitoringFilter {

    private String keyword;
    private LocalDate startPeriod;
    private LocalDate endPeriod;
    private SentimentCategory sentimentCategory;
}
