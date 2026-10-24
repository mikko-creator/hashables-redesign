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
const QWEN = 'alibaba/qwen-image-3/text-to-image', SOUL = 'higgsfield-ai/soul/standard';
const qwen = (prompt) => ({ prompt, resolution: '2k', aspect_ratio: '16:9', prompt_extend: false, enable_thinking: false, negative_prompt: NEG });
// revision 7: the home Gear band ("Rep the vibe", apparel) - Higgsfield Soul, its fashion and lifestyle photo model; 3:2
// sits closest to the band's 16:11 frame. Soul takes no negative prompt, so the exclusions ride in the prompt.
const FILM = '1970s surf film photograph look, soft film grain, natural colour, every garment plain and unprinted, no text, no letters, no logos, no signs';
const soul = (prompt) => ({ prompt: prompt + ', ' + FILM, resolution: '1080p', aspect_ratio: '3:2' });
const JOBS = [
  { id: 'H-COAST', alt: 'A New England coast road at golden hour, winding between dunes, beach grass and wild roses toward a shingled cottage and the sea',
    input: qwen('Golden hour on a quiet New England coastal road winding between low sand dunes covered in beach grass and wild pink beach roses, a weathered grey cedar-shingle beach cottage with white trim in the middle distance, the Atlantic Ocean glittering beyond, soft pink and gold evening sky, natural colour documentary photograph, sharp focus, no people, no cars, no text, no signs') },
  { id: 'H-BOARDS', alt: 'Three vintage longboard surfboards in faded aqua, coral and yellow standing in the sand before a grassy dune at sunset',
    input: qwen('Three vintage single-fin longboard surfboards standing upright side by side in pale beach sand in front of a dune with tall beach grass, the boards in faded pastel aqua, coral pink and buttery yellow with plain unmarked surfaces, late afternoon golden sun with long shadows, soft pink sky, 1970s surf photograph look, natural colour, fine film grain, no people, no text, no logos') },
  { id: 'H-TOWEL', alt: 'Overhead view of a striped pink, aqua and yellow beach towel on sand with tortoiseshell sunglasses, a straw hat and seashells',
    input: qwen('Overhead flat lay photograph on fine pale sand: a retro striped beach towel with bold hot pink, aqua and lemon yellow bands, a pair of tortoiseshell sunglasses, a straw sun hat and three small seashells resting on it, the shadow of a palm frond falling across the scene, hard bright noon sunlight, natural colour, crisp detail, no people, no text, no logos') },
  { id: 'G-RACK', endpoint: SOUL, alt: 'Plain vintage tees in coral, violet, yellow and aqua on wooden hangers in a sunlit surf shack, with a bucket hat and a faded aqua longboard against a whitewashed wall',
    input: soul('Corner of a sun-faded retro surf shack at golden hour: a row of plain vintage cotton t-shirts in sunset colours, coral pink, violet, sunny yellow and aqua, hanging on wooden hangers from a rope line, a cream canvas bucket hat on a peg, a single-fin longboard in faded aqua leaning against a whitewashed wooden wall, palm-frond shadows falling across everything, warm low sunlight, no people') },
  { id: 'G-FLATLAY', endpoint: SOUL, alt: 'Overhead view of a retro surf outfit on sand: a folded coral tee, striped board shorts, a bucket hat, tortoiseshell sunglasses, sandals and a bar of surf wax',
    input: soul('Overhead flat lay on fine pale beach sand of a retro surf outfit: a neatly folded plain faded coral-pink cotton t-shirt, violet and aqua striped vintage board shorts, a cream canvas bucket hat, tortoiseshell sunglasses, brown leather sandals and a round bar of surf wax, the long shadow of a palm frond across the scene, warm golden-hour sunlight, no people, no hands') },
  { id: 'G-SHORE', endpoint: SOUL, alt: 'A woman in a faded pink tee and bucket hat walks the shoreline at sunset with a vintage longboard under her arm',
    input: soul('A woman in her early thirties walking barefoot along the shoreline at sunset carrying a vintage single-fin longboard under her arm, seen from behind at a three-quarter angle, wearing an oversized plain faded pink cotton t-shirt over a swimsuit and a cream canvas bucket hat, wet sand mirroring a pink, violet and orange sky, gentle waves') },
  { id: 'G-TAILGATE', endpoint: SOUL, alt: 'Two friends in retro surf tees laugh on the tailgate of a vintage pickup at the beach at sunset, longboards beside them',
    input: soul('Two friends in their early thirties, a man and a woman, laughing as they sit on the open tailgate of a vintage pastel pickup truck parked at the beach at sunset, wearing retro surf apparel, plain sun-faded cotton t-shirts in coral and violet, a cream bucket hat and board shorts, two single-fin longboards leaning beside them, warm golden backlight, palm trees and the ocean behind, candid, no drinks, no smoking') },
];
const run = (j) => new Promise((res) => {
  const p = spawn(process.execPath, [path.join(PROJ, 'tools/hf-run.mjs'), '--key-file', KEY, '--endpoint', j.endpoint || QWEN,
    '--input', JSON.stringify(j.input), '--out', 'tmp/hf/' + j.id + '.img'], { cwd: PROJ, stdio: ['ignore', 'pipe', 'pipe'] });
  let o = '';
  p.stdout.on('data', (d) => { o += d; }); p.stderr.on('data', (d) => { o += d; });
  p.on('close', (code) => { console.log(j.id, code === 0 ? 'ok' : 'FAIL', o.trim().split('\n').pop()); res({ id: j.id, code, out: o.trim() }); });
});
fs.mkdirSync(path.join(PROJ, 'tmp/hf'), { recursive: true });
const todo = JOBS.filter((j) => !only || only.has(j.id));
const results = await Promise.all(todo.map(run));
// one results file per job set, so a later --only run does not overwrite an earlier record
const rec = only ? 'tmp/hf/stills-results-' + todo.map((j) => j.id).join('+') + '.json' : 'tmp/hf/stills-results.json';
fs.writeFileSync(path.join(PROJ, rec), JSON.stringify({ at: new Date().toISOString(), jobs: todo.map((j) => ({ id: j.id, endpoint: j.endpoint || QWEN, alt: j.alt, input: j.input })), results }, null, 2));
