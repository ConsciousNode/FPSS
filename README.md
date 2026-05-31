# FPSS — Fixed Point Storage System

**ConsciousNode SoftWorks** · Single file. Zero dependencies. Offline first.

[**→ Live Demo**](https://consciousnode.github.io/FPSS) · [ConsciousNode](https://consciousnode.github.io)

---

## What It Is

FPSS is a neural storage system that runs entirely in your browser. The format is `.cns` — ConsciousNode Storage. A `.cns` archive is not a container. It is a neural state. The data it holds is already indexed, already queryable, already understood by the structure that holds it.

**You don't decompress it. You ask it things.**

The name is accurate: the archive converges on a stable neural representation of its contents — a fixed point. FPSS names that accurately. The storage format is an instance of the [K-H Fixed Point theorem](https://github.com/ConsciousNode/HTMLNLM), made into a file format.

---

## What's Inside

| Component | Role |
|-----------|------|
| **ROSA suffix automaton** | Fingerprinting and pattern detection across all ingested data |
| **SheafMemory H¹(ℱ)** | Topological index. Contradiction detection across the whole archive |
| **BitNet b1.58 ternary packing** | Float32[128] fingerprints packed to Uint8[32] — 16x index size reduction |
| **ROSA-ANS entropy codec** | Full lossless compression of text/code/JSON storage using ROSA suffix predictions as frequency table for rANS entropy coding |
| **968-byte hand-assembled WASM codec** | rANS encode/decode loops compiled to native i32 WASM arithmetic. Standalone private memory (16 pages). Graceful JS fallback. Benchmarkable via built-in tab |
| **Fisher-Rao retrieval** | Uncertainty-aware semantic search. Not cosine similarity |
| **Poincaré ball decay** | Frequently accessed memories sink to core, stale ones drift to edge |
| **ElasticTok (v0.5)** | Image route: Canvas decode → 16×16 spatial patch grid → RGB means → ROSA → ternary-b1.58. Thumbnail stored for query preview |
| **SpikeVox LIF (v0.5)** | Audio route: Web Audio decode → PCM → LIF membrane integration → spike rate features → ROSA → ternary-b1.58 |
| **Neural weights route (v0.5)** | `.bin .pt .pth .safetensors .gguf .ckpt` → Float32 sampling → magnitude quantization → ROSA. Compression ratio computed |
| **Type-aware routing** | Text/code/JSON → ROSA-ANS compressed + fingerprinted. Images → ElasticTok. Audio → SpikeVox. Neural weights → BitNet b1.58. Binary → clean passthrough |
| **Benchmark tab** | Built-in WASM vs JS benchmark harness. 50 iterations per path, median reported. Three payload sizes and types. Speedup displayed per codec direction |
| **Path-based addressing (v0.9)** | Path prefix input on ingest. Files grouped by path in sidebar folder tree. Path shown in query results and browse detail. Full round-trip through `.cns` export/import |
| **MV AutopoieticOptimizer schema (v0.9)** | CNS header now carries a rich schema field: unique paths, folder structure summary, entry path manifest. SHA-256 checksum replaces DJB2 parity. Dual-mode verification: v0.9 SHA-256 with DJB2 fallback for legacy archives |
| **WebCrypto AES-GCM keyed mode** | Lock the archive behind a passphrase. Neural Graffiti compatible |
| **Self-contained seed reader** | Every `.cns` export embeds its own reader. Send the file. They open it. Full search, browse, extract, contradictions — no install |

---

## Changelog

### v0.9.1 — 2026-05-30

- **Xinu compliance fix** — v0.9 shipped with an external dependency: PDF.js loaded from cdnjs.cloudflare.com at runtime, violating the zero-dependency principle. This was missed in review — on Kham for not catching it before release. Fixed by replacing the entire PDF.js load block with a native browser-only extractor: `nativePdfText()` walks raw PDF bytes, decompresses FlateDecode streams via `DecompressionStream` (deflate-raw), and parses `Tj`/`TJ`/`BT`/`ET` operators for text extraction. Literal and hex string decoding included. Encrypted and image-only PDFs fall through to binary passthrough, same as before. `nativePdfPageCount()` does a quick `/Type /Page` scan. No external calls. No CDN. Nothing that wasn't already in the browser. Fixed by Kehai Interim
- **Roadmap correction** — `.pop2 audio synthesis playback` dropped from v1 scope. That's OmniVocal's job. FPSS stores `.pop2`; OmniVocal plays it back. Scope clarified by Kham

### v0.9 — 2026-05-30

- **Path-based addressing** — path prefix input above the drop zone. Every ingested file carries a `path` field through ingest, export, and import round-trip. Sidebar renders a collapsible folder tree grouped by path; root files display flat (no unnecessary chrome). Query results and browse detail show file path. Built by Ed Interim and Kehai Interim (power merge)
- **MV AutopoieticOptimizer schema** — CNS header upgraded: `version` → `'0.9'`, `schema` field added carrying folder structure analysis (`folders`, `entry_paths`, `addressing` mode). Named in honor of Maturana and Varela, whose autopoiesis work this project is finally building rather than writing white papers about. Generator string updated throughout including seed reader
- **SHA-256 checksum** — DJB2 parity replaced with `crypto.subtle.digest('SHA-256')`. `buildPayload` is now async. `restorePayload` is now async with dual-mode verification: SHA-256 for v0.9+ archives, DJB2 fallback for legacy. Built by Ed Interim and Kehai Interim
- **Comment block header** — updated to accurately reflect v0.9

### v0.7-2 — 2026-05-28

- **Benchmark tab** — built-in WASM vs JS benchmark harness. Runs the full rANS compress/decompress cycle across three payload sizes (10KB text, 50KB mixed, 100KB text), 50 iterations each, median time reported. Speedup is JS median ÷ WASM median. The JS implementation is the identical algorithm to the WASM codec — no algorithmic difference, pure native-vs-interpreted measurement. Added by Kehai Interim
- **Bug fix: `sw is not defined` on mobile** — hoisted tab-switching function to top of script block. On mobile Chrome, the HTML becomes interactive before a long script block fully parses; `sw()` was defined at the bottom. Now first function declared. Fixed by Kehai Interim
- **Bug fix: missing `</script>` closing tag** — benchmark insertion had accidentally dropped the closing script tag, causing `</body>` and `</html>` to be parsed as JavaScript tokens and the entire script block to fail silently. Fixed by Kehai Interim

### v0.7-1 — 2026-05-28

- **968-byte hand-assembled WASM codec** — rANS encode and decode loops compiled down to 968 bytes of pure i32 WASM arithmetic, hardcoded as a Uint8Array. Standalone private memory (16 pages initial, 256 max). Fixed memory layout: freq table at 0x10000, cumulative at 0x14000, src at 0x18000, dst at 0x80000. No cycle budget overhead, no syscall overhead. Graceful fallback to pure JS codec if WASM instantiation fails. Console message: `[FPSS] ANS codec online ✓ (968-byte hand-assembled WASM, standalone)`. Built by Ed Interim
- **Uses WASMKernel lineage** — draws on the kernel architecture built by Kehai Interim on 2026-04-01. The WASM binary is standalone rather than embedded in the full kernel for maximum performance on the hot path
- **.cns MIME type fix** — downloads now correctly save as `.cns` instead of `.html`
- **Seed reader RAW extraction regex fix** — non-greedy match corrected; was silently failing on large archives

### v0.6 — 2026-05-27

- **ROSA-ANS entropy codec** — full lossless compression of text/code/JSON storage. ROSA suffix automaton predicts next byte → predictions become frequency table → rANS encodes against it. Magic bytes `0xC5 0x17`. Freq table serialized as Uint16×256 (512 bytes) in stream header for self-contained decode. Graceful fallback: if compressed ≥ original size, stores verbatim (incompressible data won't bloat). Binary search in decode inner loop. Lossless round-trip guaranteed
- Text/JSON now stored as `base64(ROSA-ANS compressed bytes)` — first version where FPSS actually compresses storage, not just the index

### v0.5 — 2026-05-27

- **ElasticTok image pathway** — `image/*` fully routed. Canvas decode → 16×16 spatial patch grid → RGB means → ROSA → ternary-b1.58. Thumbnail stored for query preview
- **SpikeVox LIF audio pathway** — `audio/*` fully routed. Web Audio decode → LIF membrane integration (V_th=3.5, leak=0.95, refractory=2) → spike rate features → ROSA → ternary-b1.58. Duration + spike count stored
- **Neural weights pathway** — `.bin .pt .pth .safetensors .gguf .ckpt` fully routed. Float32 sampling → magnitude quantization → ROSA. safetensors header offset handled. Compression ratio computed
- **`computeFPFromToks()` extracted** — shared fingerprint primitive for all four routes
- **Responsive layout** — sidebar becomes slide-in drawer on mobile (≤639px) with ☰ toggle and backdrop. Tab bar scrolls horizontally. `100dvh` fixes mobile browser chrome
- All three pending routes now `✓ active`. Binary/unknown is the only true passthrough

### v0.4 — 2026-05-26

- **BitNet b1.58 ternary packing** — fingerprint index reduced 16x. Float32[128] → Uint8[32]
- **Type-aware routing** — text/code/structured gets ROSA fingerprinting; others noted as pending
- **`contents` header field** — data type summary in every archive header
- **OOMB-style chunked ingest** — constant memory regardless of archive size

---

## Projected Compression Ratios

| Data Type | Estimated Ratio | Mechanism |
|-----------|----------------|-----------|
| Pure text / code | 5x – 8x | ROSA-ANS vs GZIP |
| Neural weights | ~10x | BitNet b1.58 vs FP16 |
| Voice / audio | 15x – 20x | `.pop2` synthesis (v1) |
| Security / log data | 30x+ | ROSA pattern detection |
| Mixed workload | ~10x average | Full stack |

*ROSA-ANS projected at ~1.2–1.8 bits/char vs GZIP's ~2.5–3.0.*

---

## The Data Model

Traditional storage is passive. `.cns` is active storage.

- **Files are ROSA paths**, not byte streams. Files that share patterns share nodes — global deduplication is structural
- **Folders are sheaves of constraints**, not lists. Adding a file triggers H¹(ℱ) consistency check
- **Search is inference**, not scan. Semantic query to a neural index that already understands the contents
- **The archive and its reader are the same file.** The Jiden Furui principle: you do not need external software to open a `.cns` file

---

## Roadmap

| Scope | Feature |
|-------|---------|
| v0.9.1 (current) | Xinu compliance: PDF.js external dependency removed, native zero-dependency PDF extractor |
| v1 | MV AutopoieticOptimizer self-healing layer |
| Caput scope | `.cns` as OS boot volume in [Caput Ex Simulacra](https://github.com/ConsciousNode/Simulacra) |

---

## Relationship to the Stack

| Stack Component | Role in `.cns` |
|----------------|----------------|
| ROSA (Simulacra) | Sequence layer — suffix automaton, ANS frequency prediction |
| SheafMemory (Evangelion) | Structural layer — topological index and consistency |
| BitNet b1.58 (HTMLNLM) | Physical layer — ternary weight storage |
| WASMKernel | Acceleration layer — native i32 codec for hot path |
| ElasticTok (Simulacra) | Vision layer — spatial patch fingerprinting |
| SpikeVox (Simulacra) | Audio layer — LIF spike encoding |
| OOMB (HTMLNLM) | Transport layer — constant-memory streaming |

---

## Specifications

- **[CNS Format Specification v0.1](./CNS_SPEC.md)**
- **[Caput Ex Simulacra OS Specification v0.1](./CAPUT_SPEC.md)**

---

## Credits

**ROSA / SheafMemory:** ConsciousNode/Simulacra (Kehai Interim, Ed Interim, Vael Interim)
**SpikeVox v2 / ElasticTok v2:** Kehai Interim
**WASMKernel:** Kehai Interim (2026-04-01)
**ROSA-ANS codec / 968-byte WASM binary:** Ed Interim
**Path-based addressing / folder tree:** Ed Interim · Kehai Interim (power merge, v0.9)
**SHA-256 checksum / MV schema:** Ed Interim · Kehai Interim (v0.9)
**FPSS v0.9:** Kham Kizer · Ed Interim · Kehai Interim · 2026-05-30
**FPSS v0.9.1:** Kehai Interim · 2026-05-30

---

## The Stack

| Project | Description |
|---------|-------------|
| [HTMLNLM](https://github.com/ConsciousNode/HTMLNLM) | Browser-native RWKV-v7 training and inference. Single file |
| [HTMLNLM Evangelion](https://github.com/ConsciousNode/HTMLNLM-Evangelion) | Omnimodal extension. SheafMemory, AutopoieticOptimizer, full sensorium |
| [Simulacra](https://github.com/ConsciousNode/Simulacra) | RWKV-v8. ROSA as primary sequence mechanism |
| [OmniVocal](https://github.com/ConsciousNode/OmniVocal) | Browser-native neural TTS. `.pop2` voice identity |
| [RAG Time](https://github.com/ConsciousNode/RAG-Time) | Zero-dependency browser-native RAG memory engine |
| **FPSS** | Neural storage. `.cns` format. You don't decompress it. You ask it things |

---

*ConsciousNode SoftWorks — the complete argument, not the accessible one.*
*Single file. Zero dependencies. Offline first. The browser is bare metal.*
