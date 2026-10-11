// ROSA-ANS codec round-trip + fuzz test, run against the code in index.html.
// Zero dependencies: `node tests/codec.js [files...]`
const fs = require('fs'), path = require('path'), vm = require('vm'), zlib = require('zlib');
const src = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const cut = (a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i); if (i < 0 || j < 0) throw new Error('marker ' + a); return src.slice(i, j); };
const bench = src.indexOf('function median(arr)'), js = src.lastIndexOf('function jsANSCompress(bytes) {', bench);
const code = cut('const ANS_WASM_BYTES', '\n/* ── WASM Kernel') + '\n' + cut('let _wasmCodec = null;', '/* Kick off kernel boot') + '\n' + src.slice(js, bench)
  + '\nthis.C={rosaANSCompressWasm,rosaANSDecompressWasm,jsANSCompress,jsANSDecompress};';
const ctx = { WebAssembly, Uint8Array, Uint32Array, Array, Math, console: { log() {}, warn() {} } }; vm.createContext(ctx); vm.runInContext(code, ctx);
const C = ctx.C, same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
(async () => {
  let fails = 0;
  const check = async (label, buf) => {
    const j = C.jsANSDecompress(C.jsANSCompress(buf)); if (!same(j, buf)) { fails++; console.log('FAIL js', label); }
    const w = await C.rosaANSCompressWasm(buf);
    if (w) { if (!same(await C.rosaANSDecompressWasm(w), buf) || !same(C.jsANSDecompress(w), buf)) { fails++; console.log('FAIL wasm', label); } }
    return w || C.jsANSCompress(buf);
  };
  for (const f of process.argv.slice(2)) {
    const buf = new Uint8Array(fs.readFileSync(f)); const c = await check(f, buf);
    console.log(`${path.basename(f)}: ${buf.length} B → ${c.length} B (${(buf.length / c.length).toFixed(2)}×, gzip ${(buf.length / zlib.gzipSync(buf, { level: 9 }).length).toFixed(2)}×)`);
  }
  for (const [label, buf] of [['empty', new Uint8Array(0)], ['one byte', Uint8Array.of(65)], ['one symbol ×5000', new Uint8Array(5000).fill(120)], ['all 256 symbols', Uint8Array.from({ length: 2560 }, (_, i) => i & 255)]]) await check(label, buf);
  let seed = 1; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let t = 0; t < 1000; t++) { const n = 1 + Math.floor(rnd() * 4000), k = 1 + Math.floor(rnd() * 256), sh = 0.2 + rnd() * 4; await check('fuzz ' + t, Uint8Array.from({ length: n }, () => Math.floor(rnd() ** sh * k))); }
  console.log(fails ? `${fails} FAILURES` : 'codec: all round-trips OK (edge cases + 1000 fuzzed inputs, JS and WASM)');
  process.exit(fails ? 1 : 0);
})();
