// Checks that the app's plan data matches the PDF.
//  1. Counts: 5 meal periods with 4/3/3/3/3 options, 9 instructions.
//  2. Every option and instruction, letter for letter, appears in the text extracted from the PDF
//     (scripts/pdf-text.txt, made with `pdftotext source/Hooreya_1600kcal.pdf`).
//     The PDF's text layer scrambles lam-alef, brackets and spacing, so both sides are normalised
//     by dropping spaces, brackets, +/- signs, bidi marks, harakat and the letters ا/أ/إ/آ/ل.
//  3. The on-screen ingredient list rebuilds to exactly the original string.
import { readFileSync } from 'node:fs';
import { meals, instructions } from '../src/data/plan.js';

// Minimal copy of the parser in src/components/Ingredients.jsx (kept JSX-free for Node).
function splitTop(str, sep) {
  const out = []; let depth = 0, start = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '(') depth++;
    else if (c === ')') depth = Math.max(0, depth - 1);
    else if (depth === 0 && str.startsWith(sep, i)) { out.push(str.slice(start, i)); start = i + sep.length; i += sep.length - 1; }
  }
  out.push(str.slice(start));
  return out;
}
function rebuild(text) {
  const m = text.match(/^([^:+]{2,12}):\s/);
  const body = m ? text.slice(m[0].length) : text;
  const parts = splitTop(body, ' + ').map((p) => splitTop(p, ' أو '));
  return (m ? m[0] : '') + parts.map((a) => a.join(' أو ')).join(' + ');
}

const labels = ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع', 'الخيار األول'];
// Also drops bidi control marks and the +/- signs, which the text layer moves to the other side of digits.
const norm = (s) => s.replace(/½/g, '1⁄2').replace(/[\s()（）.:،,+\-\u064B-\u0652\u200E\u200F\u202A-\u202Eاأإآلـ]/g, '');

let pdfN = norm(readFileSync(new URL('./pdf-text.txt', import.meta.url), 'utf8'));
labels.forEach((l) => { pdfN = pdfN.split(norm(l)).join(''); });

let fail = 0;
const check = (ok, msg) => { console.log(`${ok ? '✓' : '✗'} ${msg}`); if (!ok) fail++; };

check(meals.length === 5, 'five meal periods');
check(JSON.stringify(meals.map((m) => m.options.length)) === '[4,3,3,3,3]', 'option counts 4/3/3/3/3');
check(instructions.length === 9, 'nine general instructions');
check(JSON.stringify(meals.map((m) => m.time)) === '["08:00","11:00","14:00","17:00","20:00"]', 'meal times 8, 11, 2, 5, 8');

meals.forEach((m) => {
  check(pdfN.includes(norm(m.titleAr)), `meal title in PDF: ${m.titleAr}`);
  m.options.forEach((o, i) => {
    check(pdfN.includes(norm(o)), `${m.id} option ${i + 1} in PDF`);
    check(rebuild(o) === o, `${m.id} option ${i + 1} display rebuilds exactly`);
  });
});
// Instruction 9's range "٤ -٦" is stored in the text layer in reverse order; the app keeps the printed order
// (checked against the rendered page), so the reversed digits are also accepted here.
instructions.forEach((s, i) => check(pdfN.includes(norm(s)) || pdfN.includes(norm(s).replace('٤٦', '٦٤')), `instruction ${i + 1} in PDF`));

console.log(fail ? `\n${fail} check(s) failed` : '\nAll content checks passed');
process.exit(fail ? 1 : 0);
