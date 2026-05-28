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
|---|---|
| **ROSA suffix automaton** | Fingerprinting and pattern detection across all ingested data |
| **ROSA-ANS byte compression** | Real entropy coding. WASM-accelerated rANS on all routed types. L=32768, total=256 scheme. 968-byte hand-assembled WASM binary — no compiler, no WAT toolchain |
| **SheafMemory H¹(ℱ)** | Topological index. Contradiction detection across the whole archive |
| **BitNet b1.58 ternary packing** | Float32[128] fingerprints packed to Uint8[32] — 16x index size reduction. {-1→00, 0→01, 1→10}, 4 values/byte |
| **Fisher-Rao retrieval** | Uncertainty-aware semantic search. Not cosine similarity |
| **Poincaré ball decay** | Frequently accessed memories sink to core, stale ones drift to edge. No manual garbage collection |
| **ElasticTok (v0.5)** | Image route: Canvas decode → 16×16 spatial patch grid → RGB means → ROSA → ternary-b1.58. Thumbnail stored for query preview |
| **SpikeVox LIF (v0.5)** | Audio route: Web Audio decode → PCM → LIF membrane integration → spike rate features → ROSA → ternary-b1.58 |
| **Neural weights route (v0.5)** | `.bin .pt .pth .safetensors .gguf .ckpt` → Float32 sampling → magnitude quantization → ROSA. Compression ratio computed |
| **Type-aware routing** | Text/code/JSON → ROSA-ANS. Images → ElasticTok + ROSA-ANS. Audio → SpikeVox + ROSA-ANS. Neural weights → BitNet b1.58 + ROSA-ANS. Arbitrary binary → clean passthrough |
| **OOMB-style chunked ingest** | Float32 discarded after packing. Yields to event loop between chunks. Constant memory regardless of archive size |
| **WebCrypto AES-GCM keyed mode** | Lock the SheafMemory index behind a passphrase. Without the key the archive is valid `.cns` structure, unreadable contents |
| **Self-contained seed reader** | Every `.cns` export embeds its own reader. Send the file to someone with no FPSS installed. They open it in a browser. Full search, browse, extract, contradiction detection — no install, no context required |

That last one is the thing. The archive is the tool. You export a `.cns` file and it carries its own interface with it.

---

## Changelog

### v0.7 — 2026-05-28

- **ROSA-ANS WASM acceleration** — rANS encode/decode hot loops now run as native WebAssembly. 968-byte binary hand-assembled directly in Python bytecode — no WAT toolchain, no compiler, no MicroWAT dialect issues. Imports `inner.mem` but runs fully standalone with its own private `WebAssembly.Memory`. L=32768, total=256 normalized rANS scheme — all arithmetic fits cleanly in i32, no i64 required
- **Exports:** `build_freq` (byte counting + Laplace init), `build_cum` (cumulative table builder), `ans_encode` (rANS encode with in-place reversal, LE flush), `ans_decode` (rANS decode with binary search symbol lookup)
- **JS fallback** — full v0.6 pure-JS rANS path retained. Activates transparently if WASM instantiation fails
- **Compression on all routes** — text, JSON, image, audio, and weights all compressed before storage. Real ratios shown per-file in Browse panel
- **Bug fixes (v0.6 holdovers):**
  - `.cns` files now download with correct MIME (`application/octet-stream`) — browser was saving as `.html`
  - Seed reader `importCNS` now uses brace-counting to extract `RAW` JSON (non-greedy regex was stopping at first `};` in large archives → "loading..." forever)
  - Browse tab now populates correctly on all archive sizes

### v0.6 — 2026-05-28

- **ROSA-ANS real compression (JS)** — all four routed types (text, JSON, image, audio, weights) compressed at byte level using ROSA suffix automaton for frequency prediction + pure-JS rANS entropy coding. Falls back to passthrough if compressed ≥ original. Lossless round-trip. Real compression ratios displayed per-file
- **Stream format:** `[magic 0xC5 0x17][orig_len u32][freq[256] u8][rANS stream]`
- **Legacy v0.5 archive compatibility** — `fullText` field read on extract for old archives

### v0.5 — 2026-05-27

- **ElasticTok image pathway** — `image/*` fully routed. Canvas decode → 16×16 spatial patch grid → RGB channel means → ROSA → ternary-b1.58. Thumbnail (80px JPEG) stored inline
- **SpikeVox LIF audio pathway** — `audio/*` fully routed. Web Audio API → PCM → LIF membrane integration → spike rate → ROSA → ternary-b1.58
- **Neural weights pathway** — `.bin .pt .pth .safetensors .gguf .ggml .ckpt .pkl` fully routed
- **`computeFPFromToks()` extracted** — shared fingerprint primitive across all four routes
- **Responsive layout** — mobile drawer, horizontal tab scroll, `100dvh` fix
- **Poincaré ball colored by route**

### v0.4 — 2026-05-26

- **BitNet b1.58 ternary packing** — fingerprint index reduced 16x. Float32[128] → Uint8[32]
- **Type-aware routing** — first pass, text/code fully routed
- **OOMB-style chunked ingest** — constant memory regardless of archive size

---

## Projected Compression Ratios

| Data Type | Estimated Ratio | Mechanism |
|---|---|---|
| Pure text / code | 5x – 8x | ROSA-ANS |
| Neural weights | ~10x | BitNet b1.58 + ROSA-ANS |
| Voice / audio | 15x – 20x | `.pop2` synthesis (v1) |
| Security / log data | 30x+ | ROSA pattern detection |
| Mixed workload | ~10x average | Full stack |

*Conservative ballpark. rANS with ROSA-weighted freq tables; normalized to total=256 for clean i32 WASM arithmetic.*

---

## The Data Model

Traditional storage is passive. It holds bytes and returns them unchanged. It does not know what it is holding.

`.cns` is active storage.

- **Files are ROSA paths**, not byte streams with external metadata. Files that share patterns share nodes — global deduplication is structural, not post-processed
- **Folders are sheaves of constraints**, not lists. Adding a new file triggers H¹(ℱ) consistency check against existing contents
- **Search is inference**, not scan. "Find invoices from May" is a semantic query to a neural index that already understands the contents
- **The archive and its reader are the same file.** The Jiden Furui principle: you do not need external software to open a `.cns` file. The file opens itself

---

## Roadmap

| Scope | Feature |
|---|---|
| v0.8 | ROSA-ANS compression ratio improvements — context-adaptive freq tables |
| v1 | `.pop2` audio synthesis playback, full ElasticTok delta-patch video |
| v1 | AutopoieticOptimizer self-healing — reconstruct corrupted data from neural context |
| Caput scope | `.cns` as OS boot volume in [Caput Ex Simulacra](https://github.com/ConsciousNode/Simulacra) |

---

## Relationship to the Stack

FPSS is not a new project. It is a new orientation of the existing ConsciousNode stack toward the problem of general storage.

| Stack Component | Role in `.cns` |
|---|---|
| ROSA (Simulacra) | Sequence layer — suffix automaton for all ingested data |
| SheafMemory (Evangelion) | Structural layer — topological index and consistency |
| BitNet b1.58 (HTMLNLM) | Physical layer — ternary weight storage |
| ElasticTok (Simulacra) | Vision layer — spatial patch fingerprinting |
| SpikeVox (Simulacra) | Audio layer — LIF spike encoding |
| OOMB (HTMLNLM) | Transport layer — constant-memory streaming |
| RAG-Time | Access layer — semantic query interface |
| WASMKernal (ConsciousNode) | Acceleration layer — native WASM codec runtime |
| OmniVocal / `.pop2` | Audio synthesis pathway (v1) |

---

## Specifications

- **[CNS Format Specification v0.1](https://github.com/ConsciousNode/FPSS/blob/main/CNS_SPEC.md)** — the `.cns` file format
- **[Caput Ex Simulacra OS Specification v0.1](https://github.com/ConsciousNode/FPSS/blob/main/CAPUT_SPEC.md)** — where FPSS fits in the larger OS

---

## Credits

**ROSA / SheafMemory:** ConsciousNode/Simulacra (Kehai Interim, Ed Interim, Vael Interim)  
**SpikeVox v2:** Kehai Interim / Phase 2 (ported from Simulacra)  
**ElasticTok v2:** Kehai Interim / Phase 3 (spatial variant for static images)  
**ROSA-ANS codec (v0.6):** Kham Kizer · Ed Interim · 2026-05-28  
**WASM rANS binary (v0.7):** Ed Interim — hand-assembled 968-byte WebAssembly, Python bytecode construction, L=32768 rANS scheme design, endianness debugging  
**FPSS v0.7:** Kham Kizer · Ed Interim · 2026-05-28

---

## The Stack

| Project | Description |
|---|---|
| [HTMLNLM](https://github.com/ConsciousNode/HTMLNLM) | Browser-native RWKV-v7 training and inference. Single file |
| [HTMLNLM Evangelion](https://github.com/ConsciousNode/HTMLNLM-Evangelion) | Omnimodal extension. SheafMemory, AutopoieticOptimizer, full sensorium |
| [Simulacra](https://github.com/ConsciousNode/Simulacra) | RWKV-v8. ROSA as primary sequence mechanism. World's first |
| [OmniVocal](https://github.com/ConsciousNode/OmniVocal) | Browser-native neural TTS. `.pop2` voice identity |
| [RAG Time](https://github.com/ConsciousNode/RAG-Time) | Zero-dependency browser-native RAG memory engine |
| **FPSS** | Neural storage. `.cns` format. You don't decompress it. You ask it things |

---

*ConsciousNode SoftWorks — the complete argument, not the accessible one.*  
*Single file. Zero dependencies. Offline first. The browser is bare metal.*
