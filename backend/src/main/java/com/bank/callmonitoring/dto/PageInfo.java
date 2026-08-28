package com.bank.callmonitoring.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageInfo {

    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int size;
}
