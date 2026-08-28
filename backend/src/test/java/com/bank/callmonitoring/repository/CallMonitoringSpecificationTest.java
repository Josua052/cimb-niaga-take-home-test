package com.bank.callmonitoring.repository;

import com.bank.callmonitoring.dto.CallMonitoringFilter;
import com.bank.callmonitoring.dto.SentimentCategory;
import com.bank.callmonitoring.entity.CallMonitoring;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CallMonitoringSpecificationTest {

    @Mock
    private Root<CallMonitoring> root;

    @Mock
    private CriteriaQuery<?> query;

    @Mock
    private CriteriaBuilder cb;

    @Mock
    private Path<String> stringPath;

    @Mock
    private Path<Integer> intPath;

    @Mock
    private Path<OffsetDateTime> datePath;

    @Mock
    private Expression<String> stringExpression;

    @Mock
    private Predicate predicate;

    @Test
    void withFilter_WhenFilterIsNull_ShouldReturnConjunction() {
        when(cb.conjunction()).thenReturn(predicate);

        Specification<CallMonitoring> spec = CallMonitoringSpecification.withFilter(null);
        Predicate result = spec.toPredicate(root, query, cb);

        assertNotNull(result);
        verify(cb).conjunction();
    }

    @Test
    void withFilter_WhenKeywordIsText_ShouldCreateLikePredicates() {
        CallMonitoringFilter filter = CallMonitoringFilter.builder()
                .keyword("Budi")
                .build();

        when(root.<String>get("callId")).thenReturn(stringPath);
        when(root.<String>get("csName")).thenReturn(stringPath);
        when(root.<String>get("customerName")).thenReturn(stringPath);
        when(cb.lower(stringPath)).thenReturn(stringExpression);
        when(cb.like(any(), anyString())).thenReturn(predicate);
        when(cb.or(any(Predicate[].class))).thenReturn(predicate);
        when(cb.and(any(Predicate[].class))).thenReturn(predicate);

        Specification<CallMonitoring> spec = CallMonitoringSpecification.withFilter(filter);
        Predicate result = spec.toPredicate(root, query, cb);

        assertNotNull(result);
        verify(cb, times(3)).like(any(), eq("%budi%"));
    }

    @Test
    void withFilter_WhenKeywordIsNumeric_ShouldCreateEqualPredicate() {
        CallMonitoringFilter filter = CallMonitoringFilter.builder()
                .keyword("85")
                .build();

        when(root.<String>get("callId")).thenReturn(stringPath);
        when(root.<String>get("csName")).thenReturn(stringPath);
        when(root.<String>get("customerName")).thenReturn(stringPath);
        when(root.<Integer>get("sentimentScore")).thenReturn(intPath);
        when(cb.lower(stringPath)).thenReturn(stringExpression);
        when(cb.like(any(), anyString())).thenReturn(predicate);
        when(cb.equal(intPath, 85)).thenReturn(predicate);
        when(cb.or(any(Predicate[].class))).thenReturn(predicate);
        when(cb.and(any(Predicate[].class))).thenReturn(predicate);

        Specification<CallMonitoring> spec = CallMonitoringSpecification.withFilter(filter);
        Predicate result = spec.toPredicate(root, query, cb);

        assertNotNull(result);
        verify(cb).equal(intPath, 85);
    }

    @Test
    void withFilter_WhenSentimentCategoryBelow70_ShouldCreateLessThanPredicate() {
        CallMonitoringFilter filter = CallMonitoringFilter.builder()
                .sentimentCategory(SentimentCategory.BELOW_70)
                .build();

        when(root.<Integer>get("sentimentScore")).thenReturn(intPath);
        when(cb.lessThan(intPath, 70)).thenReturn(predicate);
        when(cb.and(any(Predicate[].class))).thenReturn(predicate);

        Specification<CallMonitoring> spec = CallMonitoringSpecification.withFilter(filter);
        Predicate result = spec.toPredicate(root, query, cb);

        assertNotNull(result);
        verify(cb).lessThan(intPath, 70);
    }

    @Test
    void withFilter_WhenSentimentCategoryAtOrAbove70_ShouldCreateGreaterOrEqualPredicate() {
        CallMonitoringFilter filter = CallMonitoringFilter.builder()
                .sentimentCategory(SentimentCategory.AT_OR_ABOVE_70)
                .build();

        when(root.<Integer>get("sentimentScore")).thenReturn(intPath);
        when(cb.greaterThanOrEqualTo(intPath, 70)).thenReturn(predicate);
        when(cb.and(any(Predicate[].class))).thenReturn(predicate);

        Specification<CallMonitoring> spec = CallMonitoringSpecification.withFilter(filter);
        Predicate result = spec.toPredicate(root, query, cb);

        assertNotNull(result);
        verify(cb).greaterThanOrEqualTo(intPath, 70);
    }
}
