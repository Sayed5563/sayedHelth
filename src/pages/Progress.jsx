import { useState } from 'react';
import ProgressRing from '../components/ProgressRing.jsx';
import Icon from '../components/Icon.jsx';
import { meals, instructions, optionLabelsAr, optionLabelsEn } from '../data/plan.js';
import { todayKey } from '../store.js';

function lastDays(n, from) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(from);
    d.setDate(d.getDate() - (n - 1 - i));
    return d;
  });
}

export default function Progress({ t, lang, day, days, store, now }) {
  const [confirm, setConfirm] = useState(false);
  const doneCount = meals.filter((m) => day.done[m.id]).length;
  const insCount = instructions.filter((_, i) => day.ins[i]).length;
  const pct = doneCount / meals.length;
  const labels = lang === 'ar' ? optionLabelsAr : optionLabelsEn;

  const week = lastDays(7, now).map((d) => {
    const rec = days[todayKey(d)];
    const n = rec ? meals.filter((m) => rec.done?.[m.id]).length : 0;
    return { d, n, today: todayKey(d) === todayKey(now) };
  });

  // Count consecutive full days ending today (or yesterday, if today is still in progress).
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const rec = days[todayKey(d)];
    const full = rec && meals.every((m) => rec.done?.[m.id]);
    if (full) streak++;
    else if (i === 0) continue;
    else break;
  }

  // Most-chosen option per meal across all recorded days.
  const favs = meals.map((m) => {
    const counts = {};
    Object.values(days).forEach((rec) => {
      const s = rec.sel?.[m.id];
      if (s !== undefined) counts[s] = (counts[s] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? { m, idx: Number(top[0]), n: top[1] } : null;
  }).filter(Boolean);

  return (
    <div className="page page-progress">
      <header className="page-head">
        <p className="eyebrow">{t.planName}</p>
        <h1>{t.progressTitle}</h1>
      </header>

      <section className="hero-card">
        <ProgressRing value={pct} size={140} stroke={11}>
          <strong className="ring-num">{Math.round(pct * 100)}<small>%</small></strong>
          <span className="ring-cap">{t.completion}</span>
        </ProgressRing>
        <dl className="stats">
          <div><dt>{t.meals}</dt><dd>{doneCount}<span>/{meals.length}</span></dd></div>
          <div><dt>{t.habits}</dt><dd>{insCount}<span>/{instructions.length}</span></dd></div>
          <div><dt>{t.streak}</dt><dd>{streak}</dd></div>
        </dl>
      </section>

      <section className="card">
        <h3 className="section-title">{t.meals}</h3>
        <ul className="meal-bars">
          {meals.map((m) => {
            const done = day.done[m.id];
            const s = day.sel[m.id];
            return (
              <li key={m.id} className={done ? 'done' : s !== undefined ? 'half' : ''}>
                <span className="mb-name">{lang === 'ar' ? m.titleAr : m.titleEn}<small>{lang === 'ar' ? m.timeLabelAr : m.timeLabelEn}</small></span>
                <span className="mb-state">
                  {done ? <><Icon name="check" size={14} stroke={2.6} /> {t.done}</> : s !== undefined ? labels[s] : '—'}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card">
        <h3 className="section-title">{t.week}</h3>
        <div className="week" role="img" aria-label={week.map((w) => `${t.weekdays[w.d.getDay()]} ${w.n}/5`).join(', ')}>
          {week.map((w, i) => (
            <div key={i} className={`wk ${w.today ? 'today' : ''}`}>
              <span className="wk-n">{w.n}</span>
              <span className="wk-track"><span className="wk-fill" style={{ height: `${(w.n / meals.length) * 100}%` }} /></span>
              <span className="wk-day">{t.weekdays[w.d.getDay()]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3 className="section-title">{t.favourites}</h3>
        {favs.length === 0 ? <p className="muted">{t.noHistory}</p> : (
          <ul className="favs">
            {favs.map(({ m, idx, n }) => (
              <li key={m.id}>
                <span className="fav-head">
                  <strong>{lang === 'ar' ? m.titleAr : m.titleEn} · {labels[idx]}</strong>
                  <span className="pill">×{n}</span>
                </span>
                <span className="fav-text" lang="ar" dir="rtl">{m.options[idx]}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="reset">
        {!confirm ? (
          <button type="button" className="btn btn-ghost" onClick={() => setConfirm(true)}>
            <Icon name="refresh" size={18} /> {t.resetDay}
          </button>
        ) : (
          <div className="confirm">
            <span>{t.resetConfirm}</span>
            <button type="button" className="btn btn-danger" onClick={() => { store.resetDay(); setConfirm(false); }}>{t.resetDay}</button>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirm(false)}>{t.cancel}</button>
          </div>
        )}
      </div>
      <p className="privacy-note"><Icon name="info" size={15} /> {t.privacy}</p>
    </div>
  );
}
