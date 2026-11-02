import { useState } from 'react';
import Icon from './Icon.jsx';
import Ingredients, { parseOption } from './Ingredients.jsx';
import MealCover from './MealCover.jsx';
import { optionLabelsAr, optionLabelsEn } from '../data/plan.js';

const buzz = () => { try { navigator.vibrate?.(12); } catch { /* not supported */ } };

function OptionCard({ meal, idx, text, selected, t, lang, onChoose, expanded, onToggle }) {
  const { parts } = parseOption(text);
  const label = lang === 'ar' ? optionLabelsAr[idx] : optionLabelsEn[idx];
  const bodyId = `opt-${meal.id}-${idx}`;
  return (
    <article className={`option ${selected ? 'is-selected' : ''} ${expanded ? 'is-open' : ''}`}>
      <button type="button" className="option-head" aria-expanded={expanded} aria-controls={bodyId} onClick={onToggle}>
        <span className={`option-mark ${selected ? 'on' : ''}`} aria-hidden="true">
          {selected ? <Icon name="check" size={16} stroke={2.4} /> : idx + 1}
        </span>
        <span className="option-titles">
          <span className="option-label">
            {label}
            {lang === 'en' && <span className="option-label-ar" lang="ar"> · {optionLabelsAr[idx]}</span>}
          </span>
          {!expanded && <span className="option-preview" lang="ar" dir="rtl">{text}</span>}
          {expanded && <span className="option-meta">{t.items(parts.length)}</span>}
        </span>
        <Icon name="chevron" size={18} className="option-chev" />
      </button>
      <div className="option-body" id={bodyId} hidden={!expanded}>
        <Ingredients text={text} />
        <button type="button" className={`btn ${selected ? 'btn-quiet' : 'btn-primary'}`}
          onClick={() => { buzz(); onChoose(idx); }} aria-pressed={selected}>
          {selected ? <><Icon name="check" size={18} stroke={2.2} /> {t.selected}</> : t.select}
        </button>
      </div>
    </article>
  );
}

export default function MealSection({ meal, day, t, lang, onChoose, onToggleDone }) {
  const sel = day.sel[meal.id];
  const done = !!day.done[meal.id];
  const [open, setOpen] = useState(sel ?? 0);
  const [hint, setHint] = useState(false);

  const markDone = () => {
    if (sel === undefined) { setHint(true); setTimeout(() => setHint(false), 2200); return; }
    buzz();
    onToggleDone(meal.id);
  };

  return (
    <section className={`meal ${done ? 'is-done' : ''}`} id={`meal-${meal.id}`} aria-labelledby={`h-${meal.id}`}>
      <header className="meal-head">
        <MealCover meal={meal} />
        <div className="meal-titles">
          <p className="eyebrow"><Icon name="clock" size={14} /> {lang === 'ar' ? meal.timeLabelAr : meal.timeLabelEn}</p>
          <h2 id={`h-${meal.id}`}>
            {lang === 'ar' ? meal.titleAr : meal.titleEn}
            {lang === 'en' && <span className="h-ar" lang="ar">{meal.header}</span>}
          </h2>
          <p className="meal-status">
            {done ? <span className="pill pill-done"><Icon name="check" size={14} stroke={2.4} /> {t.done}</span>
              : sel !== undefined ? <span className="pill pill-sel">{t.yourChoice}: {(lang === 'ar' ? optionLabelsAr : optionLabelsEn)[sel]}</span>
              : <span className="pill">{t.options(meal.options.length)}</span>}
          </p>
        </div>
        <button type="button" className={`quick-done ${done ? 'on' : ''}`} onClick={markDone}
          aria-pressed={done} aria-label={t.markDoneAria} title={t.markDoneAria}>
          <Icon name="check" size={18} stroke={2.6} />
        </button>
      </header>

      <div className="options">
        {meal.options.map((text, i) => (
          <OptionCard key={i} meal={meal} idx={i} text={text} t={t} lang={lang}
            selected={sel === i} expanded={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
            onChoose={(idx) => onChoose(meal.id, idx)} />
        ))}
      </div>

      <div className="meal-foot">
        <button type="button" className={`btn btn-done ${done ? 'on' : ''}`} onClick={markDone}
          aria-pressed={done} aria-disabled={sel === undefined && !done}>
          <span className="tick" aria-hidden="true"><Icon name="check" size={16} stroke={2.6} /></span>
          {done ? t.done : t.markDone}
          {done && <span className="undo">{t.undo}</span>}
        </button>
        <p className={`hint ${hint ? 'show' : ''}`} role="status">{hint ? t.pickFirst : ''}</p>
      </div>
    </section>
  );
}
