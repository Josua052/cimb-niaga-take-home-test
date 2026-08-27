CREATE TABLE call_monitoring (
    id BIGSERIAL PRIMARY KEY,
    call_id VARCHAR(50) NOT NULL UNIQUE,
    call_timestamp TIMESTAMPTZ NOT NULL,
    cs_name VARCHAR(100) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    sentiment_score SMALLINT NOT NULL CHECK (sentiment_score >= 0 AND sentiment_score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_call_monitoring_timestamp ON call_monitoring (call_timestamp);
CREATE INDEX idx_call_monitoring_sentiment ON call_monitoring (sentiment_score);
CREATE INDEX idx_call_monitoring_cs_name ON call_monitoring (cs_name);

COMMENT ON TABLE call_monitoring IS 'Tabel rekaman monitoring sentimen panggilan nasabah (Event Snapshot)';
COMMENT ON COLUMN call_monitoring.id IS 'Primary Key serial unik';
COMMENT ON COLUMN call_monitoring.call_id IS 'Nomor tiket/ID referensi unik panggilan';
COMMENT ON COLUMN call_monitoring.call_timestamp IS 'Waktu terjadinya panggilan dalam timezone UTC';
COMMENT ON COLUMN call_monitoring.cs_name IS 'Nama petugas Customer Service saat panggilan berlangsung (Snapshot)';
COMMENT ON COLUMN call_monitoring.customer_name IS 'Nama nasabah saat panggilan berlangsung (Snapshot)';
COMMENT ON COLUMN call_monitoring.sentiment_score IS 'Skor sentimen nasabah (skala 0 - 100)';
COMMENT ON COLUMN call_monitoring.created_at IS 'Waktu data dicatat ke database sistem monitoring';
