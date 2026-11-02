// Presents an option's original text as a readable list.
// It only splits the string at " + " and top-level " أو " — every character of the original is kept,
// so joining the pieces back reproduces the PDF text exactly (checked in scripts/verify-content.mjs).

function splitTop(str, sep) {
  const out = [];
  let depth = 0, start = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === '(') depth++;
    else if (c === ')') depth = Math.max(0, depth - 1);
    else if (depth === 0 && str.startsWith(sep, i)) {
      out.push(str.slice(start, i));
      start = i + sep.length;
      i += sep.length - 1;
    }
  }
  out.push(str.slice(start));
  return out;
}

export function parseOption(text) {
  let dish = null;
  let body = text;
  const m = text.match(/^([^:+]{2,12}):\s/);
  if (m) { dish = m[1]; body = text.slice(m[0].length); }
  const parts = splitTop(body, ' + ').map((p) => splitTop(p, ' أو '));
  return { dish, dishSep: m ? m[0].slice(m[1].length) : '', parts };
}

export function rebuild({ dish, dishSep, parts }) {
  return (dish ? dish + dishSep : '') + parts.map((alts) => alts.join(' أو ')).join(' + ');
}

export default function Ingredients({ text }) {
  const { dish, parts } = parseOption(text);
  return (
    <div className="ingredients" lang="ar" dir="rtl">
      {dish && <p className="dish">{dish}:</p>}
      <ul>
        {parts.map((alts, i) => (
          <li key={i}>
            {i > 0 && <span className="plus" aria-hidden="true">+</span>}
            <span className="ing">
              {alts.map((a, j) => (
                <span key={j}>
                  {j > 0 && <span className="or"> أو </span>}
                  {a}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
