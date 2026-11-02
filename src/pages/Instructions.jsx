import Icon from '../components/Icon.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import { instructions, instructionsHeader, clarifications } from '../data/plan.js';

const buzz = () => { try { navigator.vibrate?.(10); } catch { /* not supported */ } };

export default function Instructions({ t, lang, day, store }) {
  const n = instructions.filter((_, i) => day.ins[i]).length;
  return (
    <div className="page page-ins">
      <header className="page-head with-ring">
        <div>
          <p className="eyebrow" lang="ar">{instructionsHeader}</p>
          <h1>{t.instructionsTitle}</h1>
          <p className="muted">{t.instructionsSub}</p>
        </div>
        <ProgressRing value={n / instructions.length} size={64} stroke={6}>
          <strong className="ring-small">{n}/{instructions.length}</strong>
        </ProgressRing>
      </header>

      <ol className="ins-list">
        {instructions.map((text, i) => {
          const on = !!day.ins[i];
          return (
            <li key={i}>
              <button type="button" className={`ins ${on ? 'on' : ''}`} aria-pressed={on}
                onClick={() => { buzz(); store.toggleInstruction(i); }}>
                <span className="ins-num">{i + 1}</span>
                <span className="ins-text" lang="ar" dir="rtl">{text}</span>
                <span className="ins-check" aria-hidden="true"><Icon name="check" size={16} stroke={2.6} /></span>
              </button>
            </li>
          );
        })}
      </ol>
      
      <figure className="plate-figure">
        <figcaption className="plate-head">
          <span>
            <span className="eyebrow">{t.plate}</span>
            <strong>{t.plateTitle}</strong>
          </span>
          <span className="pill">{t.plateSub}</span>
        </figcaption>
        <img src={`${import.meta.env.BASE_URL}plate.jpg`} alt="My Healthy Plate: ½ vegetables, ¼ protein, ¼ starch" width="643" height="698" loading="lazy" />
        <ul className="plate-legend">
          {t.plateLegend.map(([frac, label], i) => (
            <li key={label}><span className={`legend-mark lm-${i}`} aria-hidden="true" /><strong>{frac}</strong><small>{label}</small></li>
          ))}
        </ul>
      </figure>

      <p className="gentle-note"><Icon name="leaf" size={18} /> {t.gentle}</p>

      <section className="card clar">
        <h3 className="section-title"><Icon name="info" size={18} /> {t.clarTitle}</h3>
        <p className="muted small">{t.clarSub}</p>
        <ul>
          {clarifications.map((c, i) => (
            <li key={i}>
              <span className="clar-where">{c.where[lang]}</span>
              <code lang="ar" dir="rtl">{c.text}</code>
              <p lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{c[lang]}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
