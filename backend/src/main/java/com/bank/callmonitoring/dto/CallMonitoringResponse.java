package com.bank.callmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CallMonitoringResponse {

    private Long no;
    private Long id;
    private String callId;
    private OffsetDateTime callTimestamp;
    private String csName;
    private String customerName;
    private Integer sentimentScore;
}
