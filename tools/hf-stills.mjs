// hf-stills.mjs - the Higgsfield REST stills for the Hashables pitch, three at a time, through tools/hf-run.mjs.
//   node tools/hf-stills.mjs --key-file <outside the project> [--only H-COAST,H-BOARDS]
// Outputs land in tmp/hf/<id>.img (+ .json sidecar); they are reviewed by eye before any copy into assets/generated/.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PROJ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const a = process.argv.slice(2);
const KEY = a[a.indexOf('--key-file') + 1];
const only = a.includes('--only') ? new Set(a[a.indexOf('--only') + 1].split(',')) : null;
const NEG = 'illustration, painting, CGI, 3D render, cartoon, oversaturated colours, HDR, people, person, hands, faces, text, letters, signs, logos, watermark, cars';
const qwen = (prompt) => ({ prompt, resolution: '2k', aspect_ratio: '16:9', prompt_extend: false, enable_thinking: false, negative_prompt: NEG });
const JOBS = [
  { id: 'H-COAST', alt: 'A New England coast road at golden hour, winding between dunes, beach grass and wild roses toward a shingled cottage and the sea',
    input: qwen('Golden hour on a quiet New England coastal road winding between low sand dunes covered in beach grass and wild pink beach roses, a weathered grey cedar-shingle beach cottage with white trim in the middle distance, the Atlantic Ocean glittering beyond, soft pink and gold evening sky, natural colour documentary photograph, sharp focus, no people, no cars, no text, no signs') },
  { id: 'H-BOARDS', alt: 'Three vintage longboard surfboards in faded aqua, coral and yellow standing in the sand before a grassy dune at sunset',
    input: qwen('Three vintage single-fin longboard surfboards standing upright side by side in pale beach sand in front of a dune with tall beach grass, the boards in faded pastel aqua, coral pink and buttery yellow with plain unmarked surfaces, late afternoon golden sun with long shadows, soft pink sky, 1970s surf photograph look, natural colour, fine film grain, no people, no text, no logos') },
  { id: 'H-TOWEL', alt: 'Overhead view of a striped pink, aqua and yellow beach towel on sand with tortoiseshell sunglasses, a straw hat and seashells',
    input: qwen('Overhead flat lay photograph on fine pale sand: a retro striped beach towel with bold hot pink, aqua and lemon yellow bands, a pair of tortoiseshell sunglasses, a straw sun hat and three small seashells resting on it, the shadow of a palm frond falling across the scene, hard bright noon sunlight, natural colour, crisp detail, no people, no text, no logos') },
];
const run = (j) => new Promise((res) => {
  const p = spawn(process.execPath, [path.join(PROJ, 'tools/hf-run.mjs'), '--key-file', KEY, '--endpoint', 'alibaba/qwen-image-3/text-to-image',
    '--input', JSON.stringify(j.input), '--out', 'tmp/hf/' + j.id + '.img'], { cwd: PROJ, stdio: ['ignore', 'pipe', 'pipe'] });
  let o = '';
  p.stdout.on('data', (d) => { o += d; }); p.stderr.on('data', (d) => { o += d; });
  p.on('close', (code) => { console.log(j.id, code === 0 ? 'ok' : 'FAIL', o.trim().split('\n').pop()); res({ id: j.id, code, out: o.trim() }); });
});
fs.mkdirSync(path.join(PROJ, 'tmp/hf'), { recursive: true });
const todo = JOBS.filter((j) => !only || only.has(j.id));
const results = await Promise.all(todo.map(run));
fs.writeFileSync(path.join(PROJ, 'tmp/hf/stills-results.json'), JSON.stringify({ at: new Date().toISOString(), jobs: todo.map((j) => ({ id: j.id, alt: j.alt, input: j.input })), results }, null, 2));
