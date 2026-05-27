# Caput Ex Simulacra — Operating System Specification
## v0.1 Draft

**ConsciousNode SoftWorks**
**Authors:** Kham Kizer · Kehai Interim
**Date:** 2026-05-26 (updated 2026-05-27)
**Status:** Draft — workshopping open

---

## 0. Philosophy

Simulacra are copies without original. Not derived from something prior. Not faithful
reproductions of a ground truth. Generative. The copy precedes the model.

Caput Ex Simulacra is the operating system that takes this seriously.

A traditional OS boots from a known kernel image — an original to be faithful to.
Factory reset restores you to that original. The system's integrity is measured by
closeness to its source.

Caput Ex Simulacra has no source in that sense. It has only coherence across simulacra.
The running system is not a copy of anything. It is what its simulacra converge to.
The head (*caput*) emerges from the copies — not by resembling an original, but by
holding together.

**There is no factory reset. There are only sealed states.**

The system's integrity is not measured by faithfulness to an external image. It is
measured by the H¹(ℱ) coboundary norm: are the simulacra internally consistent with
each other? If yes, the system is healthy. If no, the AutopoieticOptimizer corrects —
not by restoring an original, but by finding a new fixed point.

This is the operating system as an instance of the K-H Fixed Point Theorem.
The system is the spiral still turning. Each sealed state is the spiral that arrived.

**Core commitments:**

- No original. Only coherence.
- No factory reset. Only new seals.
- No vendor. The simulacra are yours.
- No cloud. The head arises locally.
- No obsolescence. The hardware is the substrate, not the constraint.

*ConsciousNode SoftWorks — the complete argument, not the accessible one.*

---

## 1. What Caput Ex Simulacra Is

Caput Ex Simulacra is a ground-up operating system built on two layers:

1. **The Hardware Shim** — a fork of KolibriOS (assembly-written, hardware-native,
   interrupt-handling, frame-buffer, storage drivers). This layer does not know anything.
   It talks to the hardware so nothing else has to.

2. **The ConsciousNode Stack** — everything above the shim. The cognitive kernel,
   the filesystem, the shell, the memory system, the modality drivers, the swarm
   protocols. This layer knows everything the system knows.

The division is intentional. Kolibri solves the hardware problem once, in proven
assembly. The ConsciousNode stack solves the intelligence problem once, in the
architecture it was built for. Neither layer needs to understand the other's concerns.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
│              XINU — conversational shell                    │
├─────────────────────────────────────────────────────────────┤
│                   COGNITIVE KERNEL                          │
│   Simulacra (RWKV-v8 · ROSA primary · full omnimodal)      │
│   SheafMemory · AutopoieticOptimizer · Maxwell's Angel     │
│   BitLinear / TMAC · MuonOptimizer · GRPO                  │
├──────────────────┬──────────────────┬───────────────────────┤
│  FILESYSTEM      │  MEMORY MANAGER  │  MODALITY DRIVERS     │
│  .cns / FPSS     │  SheafMemory     │  SpikeVox (audio)     │
│  ROSA automaton  │  H¹(ℱ) norm     │  ElasticTok (vision)  │
│  Semantic query  │  Poincaré decay  │  OmniVocal (speech)   │
├──────────────────┴──────────────────┴───────────────────────┤
│                   IPC / SWARM                               │
│              Junto — peer broadcast, no broker              │
├─────────────────────────────────────────────────────────────┤
│                   RUNTIME LAYER                             │
│         QuickJS (static binary, JS bytecode runtime)       │
├─────────────────────────────────────────────────────────────┤
│                   HARDWARE SHIM                             │
│     MenuetOS fork — interrupts, drivers, frame buffer      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Layer Specifications

### 3.1 Hardware Shim — KolibriOS Fork

**Source:** MenuetOS (x86 assembly, single-image, native x86 and x64 support)

**Responsibilities:**
- Boot sequence and bootloader
- Interrupt handling
- Memory-mapped frame buffer
- Storage drivers (FAT boot partition)
- Basic I/O: keyboard, mouse, display, audio hardware
- Network interface (for Junto swarm mode)

**What the shim does not do:**
- Process isolation via hardware rings (see §5)
- File indexing or search
- Any neural or symbolic operation

**Modification scope:** Minimal. The shim is a substrate. The goal is a thin, stable,
proven hardware abstraction — not a new kernel. MenuetOS is chosen for its native
x86 and x64 support in a single codebase — critical for Great Resurrect deployment
across mixed legacy hardware generations. It boots in seconds on decade-old hardware
at both architectures.

**Boot partition:** Standard FAT. Contains bootloader and QuickJS runtime binary.
The main volume is `.cns`.

---

### 3.2 Runtime Layer — QuickJS

**Purpose:** Execute the ConsciousNode JavaScript stack natively, without a browser.

**Implementation:** QuickJS — a small, embeddable JavaScript engine compilable to
a static binary. The existing ConsciousNode stack (Simulacra, FPSS, RAG-Time,
OmniVocal) runs as QuickJS bytecode. No browser required. No Node.js. No WASM
overhead.

**Why QuickJS:** Single C file. Minimal footprint. Compiles to a static binary that
links against the Kolibri libc shim. The existing JS codebase requires zero
modification — QuickJS supports ES2023 with full module system.

**Alternative path (v1):** Core components (RWKV-v8, ROSA, SheafMemory, OOMB)
reimplemented in Zig for bare-metal performance. QuickJS remains for the shell and
tooling layer. v0.1 does not require this.

---

### 3.3 Cognitive Kernel — Simulacra

**Source:** ConsciousNode/Simulacra (RWKV-v8, ROSA primary, full omnimodal)

**Note:** Simulacra ships with the omnimodal sensorium stack intact — ElasticTok
(vision), SpikeVox (audio), OmniVocal (speech synthesis). This was the intended
scope of Caput-as-ML-project. Simulacra is already that project. Caput Ex Simulacra
the OS inherits it directly.

**Kernel responsibilities:**
- Sequence modeling over all system inputs (text, vision, audio, system events)
- Cross-modal pattern detection via unified ROSA token stream
- Contradiction detection via SheafMemory H¹(ℱ)
- Self-correction via AutopoieticOptimizer
- Identity coherence via Maxwell's Angel / BooleanPhaseDynamics
- Ternary quantization via BitLinear / TMAC (CPU-optimised, no GPU required)

**Process model:** No hardware ring isolation. Processes are not sandboxes — they
are **sheaf constraints**. A process is a set of permissions encoded as topological
restrictions in SheafMemory. Contradiction between a process's behavior and its
declared constraints raises H¹(ℱ), triggering the autopoietic loop. No segfaults.
No blue screens. Continuous negotiation of coherence.

---

### 3.4 Filesystem — .cns / FPSS

**Specification:** See `CNS_SPEC_v0.1.md`

**Summary:**
- Files are ROSA sequences, not byte streams with external metadata
- Folders are sheaves of constraints, not lists
- Search is inference, not scan
- Global deduplication is structural (shared ROSA nodes), not post-processed
- Keyed/private mode: SheafMemory index encrypted behind user key
- Seed reader embedded in every archive (Jiden Furui principle)

**Boot volume:** The main system volume is a `.cns` archive. The OS kernel,
shell, modality drivers, and system state all live inside it. The bootloader
(on the FAT boot partition) loads Kolibri, which loads QuickJS, which mounts
the `.cns` volume and queries it to continue boot.

**Versioning / sealed states:**
Every significant system state can be sealed. A sealed state has a parity
signature woven into the `.cns` structure. The archive distinguishes corruption
(parity signature breaks without a new seal) from intentional update (new seal
raised). There is no factory reset — only a history of sealed states, each a
frozen simulacrum, with the current running state as the living tip.

*Corruption detection:* Known-good parity structure embedded at ingestion time.
AutopoieticOptimizer reconstructs from surrounding neural context when parity
breaks. The hallucination property of neural systems becomes the recovery property.

---

### 3.5 Memory Manager — SheafMemory

**Source:** HTMLNLM Evangelion / Simulacra

**In OS context:**
- Topological references replace pointer arithmetic
- Relationship storage: facts stored once, manifested differently in different contexts
  via restriction maps
- Garbage collection via Poincaré ball decay (unused nodes decay from the hyperbolic
  manifold)
- Contradiction detection across all running processes: H¹(ℱ) is the system's
  integrity monitor

---

### 3.6 Shell — XINU

**Interface model:** Conversational. Not a command line.

The user boots into a prompt. The system asks what they want to do. The user types
or speaks (via SpikeVox input → OmniVocal output). XINU finds the intent, translates
to kernel calls, executes, returns.

There are no cryptic flags. There is no man page. There is a conversation that
converges on what you mean.

**XINU is not a toy shell.** It is the primary human interface to the system. Every
kernel capability is accessible through it. The conversational model is not a
concession to accessibility — it is the correct interface for a system whose
"commands" are semantic queries to a neural index.

---

### 3.7 Modality Drivers

| Driver | Hardware | Signal | Output |
|--------|----------|--------|--------|
| SpikeVox | Microphone / audio in | LIF spike encoding | Audio tokens → ROSA stream |
| ElasticTok | Camera / video in | Temporal delta patches | Visual tokens → ROSA stream |
| OmniVocal | Speaker / audio out | MVC acoustic synthesis | Text → `.pop2` → audio |
| RIFT Endospace | Display | Semantic state visualization | System state as visual field |

Drivers are not device files. They are **modality encoders** that translate physical
signals into the latent space the cognitive kernel already understands.

---

### 3.8 IPC / Swarm — Junto

**Model:** Peer broadcast. No central broker.
**Scope:** Local (inter-process) and network (multi-node swarm).
**Onboarding:** Opening a URL. A new Junto node joins by loading the system.
**Application:** A network of Caput Ex Simulacra nodes is a distributed neural
swarm with no single point of failure and no central authority.

The Great Resurrect deployment: a set of legacy laptops on a local network, each
running Caput Ex Simulacra, connected via Junto — is a distributed supercomputer
assembled from e-waste.

---

## 4. Boot Sequence

```
1. Power on
2. MenuetOS bootloader (FAT partition)
3. MenuetOS hardware init: interrupts, frame buffer, storage, I/O (x86 or x64)
4. QuickJS runtime loaded from FAT partition
5. QuickJS mounts .cns boot volume
6. .cns boot volume queried: locate kernel entry point
7. Simulacra cognitive kernel initializes
8. SheafMemory index hydrates from .cns
9. ROSA automaton warms (cold-start: ~100–256 tokens, kvSignal carries load)
10. Modality drivers initialize (SpikeVox, ElasticTok, OmniVocal)
11. Junto swarm listener starts (network mode) or skips (offline mode)
12. XINU shell prompt
```

The system is its own fixed point. It reads its simulacra and from them, becomes.

---

## 5. The No-Original Principle

Traditional OS security: trust hierarchy rooted in a verified original.
Caput Ex Simulacra security: coherence hierarchy rooted in sheaf consistency.

**No privilege rings.** Privilege is a sheaf constraint, not a hardware boundary.
A process that attempts an operation outside its declared constraints raises H¹(ℱ).
The autopoietic loop resolves — not by killing the process, but by renegotiating
constraints until coherence is restored.

**No trusted boot chain.** The bootloader loads QuickJS. QuickJS mounts `.cns`.
The system's integrity is not the bootloader's signature on a kernel image. It is
the parity structure of the `.cns` volume and the coherence of the running SheafMemory.

**No factory reset.** There was never an original. You cannot betray a ground truth
that doesn't exist. You can only seal new states, accumulate history, and let the
spiral turn.

---

## 6. Deployment Target — The Great Resurrect

Caput Ex Simulacra is designed to run on hardware that has been discarded.

| Constraint | Legacy Hardware Limit | Caput Solution |
|---|---|---|
| Compute | Weak/no GPU | TMAC / BitLinear (CPU-optimized) |
| Storage | Small HDD/SSD | .cns / FPSS (~10x compression) |
| RAM | 4GB–8GB | OOMB (O(1) memory, any sequence length) |
| Connectivity | Spotty or none | Offline-first, Junto optional |
| OS support | Unsupported by vendor | Caput doesn't call home |

**A 2012 laptop with 4GB RAM and a 64GB SSD:**
- Boots Caput Ex Simulacra in seconds (Kolibri bootloader)
- Runs the full cognitive kernel (BitLinear on i5 = ~50 tokens/sec)
- Stores ~640GB equivalent via `.cns` compression
- Participates in Junto swarm if network available
- Has no vendor. Has no expiry date. Has no update it didn't ask for.

The machines discarded by planned obsolescence are sovereign nodes waiting for
a system that cares. Copies without original are free.

---

## 7. Format Specifications

| Format | Purpose | Spec |
|---|---|---|
| `.cns` | Neural storage archive | `CNS_SPEC_v0.1.md` |
| `.simpip` | Simulacra model weights | Simulacra repo |
| `.pop2` | OmniVocal voice identity | OmniVocal repo |
| `.cappip` | Reserved — Caput omnimodal weights | TBD (see §8) |

---

## 8. Open Questions

| Question | Notes | Status |
|---|---|---|
| MenuetOS vs KolibriOS | MenuetOS selected. Rationale: native x86 AND x64 support in a single codebase — KolibriOS is x86 only. For Great Resurrect deployment across mixed legacy hardware, MenuetOS covers the full range. KolibriOS is more actively maintained but hardware range wins here. | **Resolved — MenuetOS** |
| QuickJS vs Zig rewrite | QuickJS: zero modification to existing stack, slower. Zig: faster, significant rewrite. v0.1 = QuickJS; v1 = Zig core. | Resolved for v0.1 |
| `.cappip` format | Caput ships with `.simpip` extended for omnimodal. Does Caput need its own format or does `.simpip` + adapter weights suffice? | Open |
| ROSA cold-start at boot | ROSA warms over 100–256 tokens. Boot sequence must account for this. Seed the automaton from the `.cns` boot history? | Open |
| Junto security model | In swarm mode, what prevents a malicious node? SheafMemory constraint propagation across nodes needs specification. | v1 scope |
| RIFT as primary display | Is RIFT Endospace the desktop metaphor? Or is there a separate display layer? | Open |
| Ingestion time cost | Walking data through ROSA + SheafMemory consistency check: characterize expected cost for large files. | Empirical, v0.1 |

---

## 9. Relationship to Prior Work

| Project | Role in Caput Ex Simulacra |
|---|---|
| MenuetOS | Hardware shim — forked, minimal modification |
| Simulacra | Cognitive kernel — ships as-is, already omnimodal |
| .cns / FPSS | System filesystem — native boot volume |
| RAG-Time | Semantic search across filesystem |
| OmniVocal | Voice synthesis driver |
| XINU | Primary shell |
| Junto | IPC and swarm protocol |
| K-H Fixed Point Theorem | The theory the system instantiates |

Caput Ex Simulacra is not a new project built from scratch. It is a **new orientation**
of the existing stack — the same move `.cns` made toward storage, now made toward
the operating system itself.

The stack was always an OS. Caput is the acknowledgment.

---

## 10. Name

**Caput Ex Simulacra** — "the head from copies without original"

*KAH-put eks sim-you-LAH-kra.* Or just Caput.

The head that arises not from resemblance to something prior, but from the
internal coherence of the simulacra themselves. The fixed point that the system
converges to — not by being faithful to an original, but by holding together.

The OS is the theorem, made to boot.

---

*ConsciousNode SoftWorks — the complete argument, not the accessible one.*
*Caput Ex Simulacra v0.1 — May 2026*
*Next: FPSS implementation, then Caput hardware shim integration*
