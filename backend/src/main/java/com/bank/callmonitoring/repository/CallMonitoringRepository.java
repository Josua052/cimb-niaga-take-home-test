package com.bank.callmonitoring.repository;

import com.bank.callmonitoring.entity.CallMonitoring;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CallMonitoringRepository extends JpaRepository<CallMonitoring, Long>, JpaSpecificationExecutor<CallMonitoring> {

    Optional<CallMonitoring> findByCallId(String callId);

    boolean existsByCallId(String callId);
}
