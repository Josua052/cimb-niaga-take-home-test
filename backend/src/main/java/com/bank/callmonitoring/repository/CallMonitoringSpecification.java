package com.bank.callmonitoring.repository;

import com.bank.callmonitoring.dto.CallMonitoringFilter;
import com.bank.callmonitoring.dto.SentimentCategory;
import com.bank.callmonitoring.entity.CallMonitoring;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

public class CallMonitoringSpecification {

    private CallMonitoringSpecification() {
    }

    public static Specification<CallMonitoring> withFilter(CallMonitoringFilter filter) {
        return (Root<CallMonitoring> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            if (filter == null) {
                return cb.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(filter.getKeyword())) {
                String searchPattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                List<Predicate> keywordPredicates = new ArrayList<>();

                keywordPredicates.add(cb.like(cb.lower(root.<String>get("callId")), searchPattern));
                keywordPredicates.add(cb.like(cb.lower(root.<String>get("csName")), searchPattern));
                keywordPredicates.add(cb.like(cb.lower(root.<String>get("customerName")), searchPattern));

                try {
                    int parsedScore = Integer.parseInt(filter.getKeyword().trim());
                    if (parsedScore >= 0 && parsedScore <= 100) {
                        keywordPredicates.add(cb.equal(root.<Integer>get("sentimentScore"), parsedScore));
                    }
                } catch (NumberFormatException ignored) {
                }

                predicates.add(cb.or(keywordPredicates.toArray(new Predicate[0])));
            }

            if (filter.getStartPeriod() != null) {
                OffsetDateTime startDateTime = filter.getStartPeriod().atStartOfDay().atOffset(ZoneOffset.UTC);
                predicates.add(cb.greaterThanOrEqualTo(root.<OffsetDateTime>get("callTimestamp"), startDateTime));
            }

            if (filter.getEndPeriod() != null) {
                OffsetDateTime endDateTime = filter.getEndPeriod().atTime(LocalTime.MAX).atOffset(ZoneOffset.UTC);
                predicates.add(cb.lessThanOrEqualTo(root.<OffsetDateTime>get("callTimestamp"), endDateTime));
            }

            if (filter.getSentimentCategory() != null) {
                if (filter.getSentimentCategory() == SentimentCategory.BELOW_70) {
                    predicates.add(cb.lessThan(root.<Integer>get("sentimentScore"), 70));
                } else if (filter.getSentimentCategory() == SentimentCategory.AT_OR_ABOVE_70) {
                    predicates.add(cb.greaterThanOrEqualTo(root.<Integer>get("sentimentScore"), 70));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
