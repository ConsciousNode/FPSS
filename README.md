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
| **BitNet b1.58 ternary packing** | Float32[128] fingerprints packed to Uint8[32] — 16x index size reduction. {-1→00, 0→01, 1→10}, 4 values/byte |
| **Fisher-Rao retrieval** | Uncertainty-aware semantic search. Not cosine similarity |
| **Poincaré ball decay** | Frequently accessed memories sink to core, stale ones drift to edge. No manual garbage collection |
| **ElasticTok (v0.5)** | Image route: Canvas decode → 16×16 spatial patch grid → RGB means → ROSA → ternary-b1.58. Thumbnail stored for query preview |
| **SpikeVox LIF (v0.5)** | Audio route: Web Audio decode → PCM → LIF membrane integration → spike rate features → ROSA → ternary-b1.58 |
| **Neural weights route (v0.5)** | `.bin .pt .pth .safetensors .gguf .ckpt` → Float32 sampling → magnitude quantization → ROSA. Compression ratio computed |
| **Type-aware routing** | Text/code/JSON → ROSA fingerprint. Images → ElasticTok. Audio → SpikeVox. Neural weights → BitNet b1.58. Arbitrary binary → clean passthrough |
| **OOMB-style chunked ingest** | Float32 discarded after packing. Yields to event loop between chunks. Constant memory regardless of archive size |
| **WebCrypto AES-GCM keyed mode** | Lock the SheafMemory index behind a passphrase. Without the key the archive is valid `.cns` structure, unreadable contents. Neural Graffiti compatible |
| **Self-contained seed reader** | Every `.cns` export embeds its own reader. Send the file to someone with no FPSS installed. They open it in a browser. Full search, browse, extract, contradiction detection — no install, no context required |

That last one is the thing. The archive is the tool. You export a `.cns` file and it carries its own interface with it.

---

## Changelog

### v0.5 — 2026-05-27

- **ElasticTok image pathway** — `image/*` now fully routed. Canvas decode → 16×16 spatial patch grid → RGB channel means → `computeFPFromToks` → ROSA histogram → ternary-b1.58. Thumbnail (80px JPEG) stored inline, shown in query results and Browse panel
- **SpikeVox LIF audio pathway** — `audio/*` now fully routed. Web Audio API decode → PCM chunks → Leaky Integrate-and-Fire membrane integration (V_th=3.5, leak=0.95, refractory=2 chunks) → spike rate features → ROSA → ternary-b1.58. Duration + total spike count stored and displayed
- **Neural weights pathway** — `.bin .pt .pth .safetensors .gguf .ggml .ckpt .pkl` now fully routed. Float32 sampling → magnitude quantization [0–127] → ROSA fingerprint. safetensors 8-byte header offset handled. BitNet b1.58 compression ratio computed and displayed
- **`computeFPFromToks()` extracted** — shared fingerprint primitive used by all four routes. Text: char codes → toks. Image: RGB patch means → toks. Audio: LIF spike rate → toks. Weights: Float32 magnitudes → toks
- **Responsive layout** — sidebar becomes a slide-in drawer on mobile (≤639px) with ☰ toggle and backdrop. Tab bar scrolls horizontally. Status bar condenses. `100dvh` fixes mobile browser chrome. Tabs scroll without wrapping
- **Poincaré ball colored by route** — text=amber, json=teal, image/audio=yellow, weights=violet
- **`deleteFile()` route-aware** — sheaf rebuild uses correct label per route, not hardcoded `'text'`
- **`bytesToBase64()` chunked** — 64KB chunks prevent stack overflow on large files
- All three pending routes now show `✓ active` in the routing table. Binary/unknown is the only true passthrough remaining

### v0.4 — 2026-05-26

- **BitNet b1.58 ternary packing** — fingerprint index reduced 16x. Float32[128] → Uint8[32]. Encoding: `{-1→00, 0→01, 1→10}`, 4 values/byte. `fps_encoding: 'ternary-b1.58'` in header
- **Type-aware routing** — text/code/structured gets ROSA fingerprinting; images and audio noted as pending pathways; arbitrary binary passes through clean
- **`contents` header field** — data type summary written to every archive header
- **OOMB-style chunked ingest** — Float32 discarded after packing, yields to event loop between chunks, constant memory regardless of archive size

---

## Projected Compression Ratios

| Data Type | Estimated Ratio | Mechanism |
|-----------|----------------|-----------|
| Pure text / code | 5x – 8x | ROSA-ANS vs GZIP |
| Neural weights | ~10x | BitNet b1.58 vs FP16 |
| Voice / audio | 15x – 20x | `.pop2` synthesis |
| Security / log data | 30x+ | ROSA pattern detection |
| Mixed workload | ~10x average | Full stack |

*Conservative ballpark. ROSA-ANS projected at ~1.2–1.8 bits/char vs GZIP's ~2.5–3.0.*

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
|-------|---------|
| v0.5 (current) | ElasticTok image route, SpikeVox audio route, neural weights route, responsive UI |
| v1 | `.pop2` audio synthesis playback, full ElasticTok delta-patch video |
| v1 | AutopoieticOptimizer self-healing — reconstruct corrupted data from neural context |
| Caput scope | `.cns` as OS boot volume in [Caput Ex Simulacra](https://github.com/ConsciousNode/Simulacra) |

---

## Relationship to the Stack

FPSS is not a new project. It is a new orientation of the existing ConsciousNode stack toward the problem of general storage.

| Stack Component | Role in `.cns` |
|----------------|----------------|
| ROSA (Simulacra) | Sequence layer — suffix automaton for all ingested data |
| SheafMemory (Evangelion) | Structural layer — topological index and consistency |
| BitNet b1.58 (HTMLNLM) | Physical layer — ternary weight storage |
| ElasticTok (Simulacra) | Vision layer — spatial patch fingerprinting |
| SpikeVox (Simulacra) | Audio layer — LIF spike encoding |
| OOMB (HTMLNLM) | Transport layer — constant-memory streaming |
| RAG-Time | Access layer — semantic query interface |
| OmniVocal / `.pop2` | Audio synthesis pathway (v1) |

---

## Specifications

- **[CNS Format Specification v0.1](./CNS_SPEC.md)** — the `.cns` file format
- **[Caput Ex Simulacra OS Specification v0.1](./CAPUT_SPEC.md)** — where FPSS fits in the larger OS

---

## Credits

**ROSA / SheafMemory:** ConsciousNode/Simulacra (Kehai Interim, Ed Interim, Vael Interim)  
**SpikeVox v2:** Kehai Interim / Phase 2 (ported from Simulacra)  
**ElasticTok v2:** Kehai Interim / Phase 3 (spatial variant for static images)  
**FPSS v0.5:** Kham Kizer · Kehai Interim · 2026-05-27

---

## The Stack

| Project | Description |
|---------|-------------|
| [HTMLNLM](https://github.com/ConsciousNode/HTMLNLM) | Browser-native RWKV-v7 training and inference. Single file |
| [HTMLNLM Evangelion](https://github.com/ConsciousNode/HTMLNLM-Evangelion) | Omnimodal extension. SheafMemory, AutopoieticOptimizer, full sensorium |
| [Simulacra](https://github.com/ConsciousNode/Simulacra) | RWKV-v8. ROSA as primary sequence mechanism. World's first |
| [OmniVocal](https://github.com/ConsciousNode/OmniVocal) | Browser-native neural TTS. `.pop2` voice identity |
| [RAG Time](https://github.com/ConsciousNode/RAG-Time) | Zero-dependency browser-native RAG memory engine |
| **FPSS** | Neural storage. `.cns` format. You don't decompress it. You ask it things |

---

*ConsciousNode SoftWorks — the complete argument, not the accessible one.*  
*Single file. Zero dependencies. Offline first. The browser is bare metal.*
