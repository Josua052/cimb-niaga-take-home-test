package com.bank.callmonitoring;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:postgresql://localhost:5432/call_monitoring",
    "spring.flyway.enabled=false"
})
class CallMonitoringApplicationTests {

    @Test
    void contextLoads() {
    }
}
