# PNG Electoral System – Epics, Repo Scaffolds, and Initial User Stories

## Mission Threads (Anchor)
Clean and deduplicated rolls integrated with NID, secure voter authentication, LPV-ready counting, reliable results transmission in low-connectivity contexts, logistics excellence, and inclusion for remote areas and persons with disabilities—aligned with a neutral comparative learning forum (PNGEC, DICT/PNG NID, international practitioners).

## Epics
- BVR-ENROLLMENT: Offline-first kit app and enrollment flows (face + fingerprint + documents)
- DEDUPE-PIPELINE: Blocking + ML-assisted candidate selection; biometric/biographic fusion; adjudication console
- NID-GATEWAY: Read-only claims from PNG NID; consent-gated; evidence tokens; never auto-delete
- POLL-ID: Polling station verification (biometric/QR), issuance control, exceptions, accessibility
- LPV-ENGINE: PNG LPV counting (elimination rounds, redistribution, auditable snapshots)
- RESULTS-HUB: Store-and-forward multi-path transmission (SMS/USSD, IP, sneaker-net), receipts and sequence checks
- AUDIT-PORTAL: Immutable event logs, WORM hash chains, random manual audits, risk dashboards
- COMMS-PORTAL: Prebunk library, rumor rebuttal workflow, media kits and situation briefs
- LOGISTICS: Asset tracking, provisioning, routing, telemetry, staff training & attendance

## Cross-Cutting
- SEC-PRIVACY-AUDIT: Consent, legal bases, RLS, dual control, published audit procedures
- OBSERVABILITY: Metrics, logs, traces, dashboards
- ACCESSIBILITY: WCAG, disability flags, large text/contrast/audio prompts
- OFFLINE-FIRST: Queues, retries, signatures, local evidence caches

## Repositories (suggested)
- /platform-infra (IaC, secrets)
- /bvr-kit
- /poll-id
- /biometrics-svc
- /voter-registry
- /dedupe-pipeline
- /lpv-engine
- /results-hub
- /audit-portal
- /comms-portal
- /logistics

## Initial User Stories (DoD Included)

### BVR-ENROLLMENT
- As an Enumerator, I can enroll a voter offline capturing face, fingerprints, documents, location, and accessibility flags; the packet is signed and queued for sync.
  - DoD: Packet stored locally; signature generated; sync succeeds when online; audit log recorded.

### DEDUPE-PIPELINE
- As a Supervisor, I can view potential duplicates produced by blocking and fused similarity (name, DOB, face), and adjudicate them to Unique/Duplicate/Re-issue/Reject.
  - DoD: Candidates listed with scores and reasons; decision recorded; audit trail created; RLS applied.

### NID-GATEWAY
- As an Administrator, I can verify a voter against PNG NID (with consent), storing an evidence token and confidence; never auto-delete solely on mismatch.
  - DoD: Evidence token generated; lookup logged with hash chain; citizen cached locally.

### POLL-ID
- As a Polling Officer, I can verify voters by biometric or QR with assisted verification flows for exceptions.
  - DoD: 1:1 verification in <30s; exception path; accessibility prompts; audit logs with device ID.

### LPV-ENGINE
- As a RO/ARO, I can run LPV counting with elimination rounds and redistribution, producing JSON snapshots and human-readable reports.
  - DoD: Rounds generated deterministically; reproducible JSON; per-round tallies; export available.

### RESULTS-HUB
- As a Polling Officer, I can transmit results packets via store-and-forward queues, with SMS/USSD chunking fallback and receipt proofs.
  - DoD: Packet queued; transmission attempted; retried; receipt hash stored; sequence checks applied.

### AUDIT-PORTAL
- As an Observer, I can view immutable event logs and public-verifiable hashes for results snapshots.
  - DoD: Logs paginated; hash chain computed; snapshot hashes published.

### COMMS-PORTAL
- As a Communications Lead, I can prebunk myths and run a rumor rebuttal workflow with SLAs and media kits.
  - DoD: Content library; workflow state; timestamps; dissemination checklist.

### LOGISTICS
- As Operations, I can track kits/assets, routing, telemetry, and staff training/attendance.
  - DoD: Assets registered; movement events; device heartbeat; training roster and completion.

## PNG Design Takeaways (embedded)
1) Stage biometrics and audits; 2) design for low-bandwidth/offline; 3) formalize audit+comms layer; 4) embed LPV rules; 5) NID high-trust but independent audit trails.

## Acceptance Criteria & KPIs (Targets)
- Registration: duplicate rate ≤ 0.5%; adjudication SLA < 5 days; % strong NID linkage reported.
- Polling verification: 95% verified in <30s; assisted <5%; accessibility satisfaction ≥ 90%.
- Results: 95% precincts reported within H+12; end-to-end audit pass ≥ 99%; LPV reproducibility 100%.
- Comms: rumor response median <2h; prebunk reach targets.

## Early Risk Tests
- Connectivity poverty: prove SMS/USSD relays & sneaker-net ingestion.
- Biometric equity: test manual-labor populations; enable multi-modal backups.
- Legal/consent: granular consent for NID queries; data minimization.
- Transparency: publish test plans; sample results with public hashes.

## Done-Right Anchors
- Hardware-backed keys, signed packets, per-event hash chains, WORM; dual control; published audits; independent register audit.
