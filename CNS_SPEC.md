# ConsciousNode Storage Format Specification
## `.cns` — The ConsciousNode Storage Standard

**Version:** 0.1 (Draft)
**Status:** Workshopping
**Authors:** ConsciousNode SoftWorks (Kham, Kehai Interim, Ed Interim, Vael Interim)
**Date:** 2026-05-26

---

## 0. Philosophy

Traditional storage is passive. It holds bytes and returns them unchanged. It does not know what it is holding.

`.cns` is active storage. A `.cns` archive is not a container — it is a **neural state**. The data it holds is already indexed, already queryable, already understood by the structure that holds it. You do not decompress a `.cns` file. You **ask it things.**

This follows directly from the Xinu principle: do one thing well, then ask what else it can do within the same constraints. The ConsciousNode stack was built for browser-native neural inference. `.cns` is what happens when you point that stack at the problem of storage.

**Core commitments:**
- Single file. The archive and its reader are the same file.
- Zero dependencies. Opens in any browser, on any hardware, without installation.
- Offline first. No cloud required. No phone home.
- Active by default. The data is live the moment the file is opened.
- Constraint engineering. The format's limits are its features.

---

## 1. What `.cns` Is

A `.cns` file is a self-contained HTML file comprising:

1. **A ROSA suffix automaton** — the sequence layer. All ingested data exists as paths through this automaton. Files that share patterns share nodes. Global deduplication is structural, not post-processed.

2. **A SheafMemory index** — the structural layer. Relationships between data items are stored as topological constraints. The archive detects internal contradictions via H¹(ℱ) coboundary norm.

3. **BitNet b1.58 ternary weights** — the physical layer. Neural representations stored at ~1.58 bits per parameter. ~10x reduction vs FP16 baseline.

4. **An OOMB streaming manager** — the transport layer. Constant O(1) memory usage during ingestion and extraction regardless of archive size.

5. **A RAG-Time query interface** — the access layer. Semantic search across the entire archive without decompression. Search is inference, not scan.

6. **A minimal reader UI** — browser-native interface for browsing, querying, and extracting contents.

---

## 2. Projected Compression Ratios

*From Manus analysis, 2026-05-25:*

| Data Type | Estimated Ratio | Mechanism |
|-----------|----------------|-----------|
| Pure text / code | 5x – 8x | ROSA-ANS vs GZIP |
| Neural weights | ~10x | BitNet b1.58 vs FP16 |
| Voice / audio | 15x – 20x | `.pop2` synthesis |
| Security / log data | 30x+ | ROSA pattern detection |
| Mixed workload | ~10x average | Full stack |

*Conservative ballpark. ROSA-ANS projected at ~1.2–1.8 bits/char vs GZIP's ~2.5–3.0.*

---

## 3. The Data Model

### 3.1 You Don't Save Files. You Ingest States.

In a traditional filesystem, a file is a stream of bytes with external metadata (name, size, date).

In `.cns`, a file is a **ROSA path** with **semantic metadata**. The file knows what it is via its embedding. Multiple files sharing patterns share ROSA nodes automatically.

### 3.2 The File as ROSA Sequence

Ingestion walks the data through the suffix automaton, building or extending paths. Extraction traverses the automaton along the stored path. Files with identical subsequences share structure — global deduplication at no extra cost.

### 3.3 The Folder as Sheaf

A directory is not a list. It is a **sheaf of constraints** defining relationships between its contents. Adding a new file triggers H¹(ℱ) consistency check against existing contents. Contradictions are flagged, not silently absorbed.

### 3.4 Search as Inference

Querying the archive is a RAG-Time operation against the SheafMemory index. "Find invoices from May" is not a filename scan — it is a semantic query to a neural index that already understands the contents.

---

## 4. File Header (Proposed)

*To be workshopped — these are first-pass fields.*

```
[CNS HEADER]
version:     0.1
created:     ISO-8601 timestamp
generator:   ConsciousNode SoftWorks
stack:       ROSA / SheafMemory / BitNet-b1.58 / OOMB
contents:    [data type summary — text, weights, audio, mixed]
entry_count: N
schema:      [sheaf key structure — TBD]
checksum:    [integrity hash — TBD]
[/CNS HEADER]
```

---

## 5. Format Versioning

`.cns` will need versions. Version 0.1 is the spec-in-progress. Questions for versioning:

- What constitutes a breaking change? (ROSA automaton structure, SheafMemory schema, BitNet quantization level)
- Can a newer reader open an older archive? (Aim: yes, always.)
- Can an older reader open a newer archive? (Aim: graceful degradation.)

---

## 6. Resolved Architecture Decisions

*Workshopped 2026-05-26. These questions are closed.*

---

**Q1: Minimal reader — RESOLVED**

Every `.cns` archive ships with a **seed reader**: a minimal embedded extraction interface sufficient to browse and extract contents without the full query stack. The full FPSS interface (see Q6) is the complete experience. The seed reader is the floor — always present, always functional, zero dependencies.

This follows the Jiden Furui principle: the archive is the tool. You do not need external software to open a `.cns` file. The file opens itself.

---

**Q2: SheafMemory key structure — RESOLVED**

Both path-based and semantic hash addressing, as complementary access modes — not redundancy.

- **Path-based:** Human navigation. `documents/invoices/may2026` gets you there when you know where something is.
- **Semantic hash:** System navigation. The sheaf finds related items by what they *are*, across type boundaries, even without a known path.

These answer the same underlying question from two positions. One is for the user. One is for the archive itself. Both are always available.

---

**Q3: Omnimodal ingestion — RESOLVED**

Each data type gets its own **ROSA automaton** as background layer. A central **controller interface** coordinates routing, type detection, and cross-type sheaf relationships in the foreground.

This means each automaton is optimized for its data type without interference. The controller maintains the unified SheafMemory index across all automata. Cross-modal queries (find items related to this audio clip) route through the controller, not through individual automata.

---

**Q4: Keyed/private mode — RESOLVED, IN SCOPE**

`.cns` v0.1 includes a **lock-and-key mode**: the SheafMemory index is encrypted behind a user-supplied key. Without the key, the archive is opaque — valid `.cns` structure, unreadable contents.

This enables the Neural Graffiti use case: an archive that appears to be a normal `.cns` file is, to a keyed reader, a hidden library. The data is the model. The key is the knowledge that there is something to find.

Practical use cases beyond steganography: private archives, secure local storage on shared hardware, keyed distribution of `.cns` files.

---

**Q5: Self-healing via AutopoieticOptimizer — RESOLVED, v1 SCOPE**

Self-healing is confirmed for v1. The AutopoieticOptimizer can reconstruct corrupted data from surrounding neural context — the "hallucination" property of neural systems becomes a recovery property for storage.

The stack is already built. Using it is the obvious move. v0.1 focuses on ingestion, extraction, and the query interface. v1 adds self-healing as an active integrity layer.

---

**Q6: Interface name — RESOLVED**

The reader/interface is the **Fixed Point Storage System (FPSS)**.

The archive converges on a stable neural representation of its contents — a fixed point. The name connects directly to the K-H Fixed Point framework without being decorative about it. The storage format *is* an instance of the theory. FPSS names that accurately.

`.cns` is the format. FPSS is the system that reads and writes it.

---

## 7. Relationship to Existing Stack

| Stack Component | Role in `.cns` |
|----------------|----------------|
| ROSA (Simulacra) | Sequence layer — suffix automaton for all ingested data |
| SheafMemory (Evangelion) | Structural layer — topological index and consistency |
| BitNet b1.58 (HTMLNLM) | Physical layer — ternary weight storage |
| OOMB (HTMLNLM) | Transport layer — constant-memory streaming |
| RAG-Time | Access layer — semantic query interface |
| OmniVocal / `.pop2` | Audio compression pathway |
| ElasticTok | Vision/video compression pathway |

`.cns` is not a new project. It is a **new orientation** of the existing stack toward the problem of general storage.

---

## 8. Data Routing & Fallback

`.cns` does not assume ROSA handles everything. The SheafMemory index knows the type of each ingested item and routes it to the appropriate compression pathway. This is not a workaround — it is the architecture.

### 8.1 Routing Table (Proposed)

| Data Type | Primary Pathway | Fallback |
|-----------|----------------|---------|
| Text / code / logs | ROSA-ANS | — |
| Neural weights | BitNet b1.58 ternary packing | — |
| Voice / audio | SpikeVox → `.pop2` synthesis | ROSA-ANS on raw signal |
| Video / image | ElasticTok delta-patch encoding | ROSA-ANS on decoded frames |
| Structured data (JSON, CSV) | ROSA-ANS | — |
| Arbitrary binary | ROSA global suffix automaton | Passthrough (no penalty) |
| Encrypted data | Passthrough | — |

### 8.2 The Passthrough Principle

Data that resists compression is stored as-is with no penalty. The archive does not fail on incompressible data — it routes around it. The SheafMemory index still understands what the item *is* and where it lives; it simply stores it at 1:1 ratio rather than compressed.

This means the 10x average holds for realistic mixed workloads even if a fraction of the archive is incompressible. The average is not pulled down by outliers — it gracefully degrades per item.

### 8.3 The Omnimodal Advantage

Already-compressed formats (JPEG, MP4, ZIP) look arbitrary at the byte level. ROSA gets little from them. But ElasticTok and SpikeVox decode these formats back into signal space — where structure *does* exist — and recompress in a representation native to the stack.

This means the routing answer to "ROSA can't compress X" is often "decode X into a space where a different stack component can." The sheaf coordinates this transparently. The user ingests a JPEG; the archive stores a set of ElasticTok delta-patches.

### 8.4 ROSA on Arbitrary Binary

ROSA's global suffix automaton sees the entire file simultaneously — no sliding window limit. Traditional compressors (LZ77, Zstd) are bounded by lookback distance. For binary data with deep structural regularity at scales larger than those windows — executables, firmware, large structured binaries — ROSA may find patterns that sliding-window approaches cannot reach.

This is an open empirical question. The architecture does not depend on a particular answer. If ROSA proves strong on arbitrary binary, the compression ratios improve. If it proves weak, passthrough handles it gracefully. Either outcome is acceptable.

---

## 9. What This Is Not

- Not a compression utility. ZIP gives you back the file. `.cns` gives you back a reasoning system that contains the file.
- Not cloud storage. No server. No account. No connection required.
- Not a database. Though it queries like one.
- Not finished. This is version 0.1, workshopped in conversation on 2026-05-26.

---

*ConsciousNode SoftWorks — the complete argument, not the accessible one.*
*`.cns` — you don't decompress it. You ask it things.*
