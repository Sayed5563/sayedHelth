import { useEffect } from 'react';
import MealSection from '../components/MealSection.jsx';
import Icon from '../components/Icon.jsx';
import { meals } from '../data/plan.js';

export default function Plan({ t, lang, day, store, focus }) {
  useEffect(() => {
    if (!focus) return;
    const el = document.getElementById(`meal-${focus}`);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [focus]);

  const doneCount = meals.filter((m) => day.done[m.id]).length;
  const jump = (id) => document.getElementById(`meal-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="page page-plan">
      <header className="page-head">
        <p className="eyebrow">{t.planName}</p>
        <h1>{t.nav.plan}</h1>
        <p className="muted">{t.planIntro}</p>
      </header>

      <div className="plan-line">
        <span>{t.planLine(doneCount, meals.length)}</span>
        <span className="thin-track" aria-hidden="true"><i style={{ width: `${(doneCount / meals.length) * 100}%` }} /></span>
      </div>

      <nav className="meal-chips" aria-label={t.todayMeals}>
        {meals.map((m) => (
          <button key={m.id} type="button" className={`chip ${day.done[m.id] ? 'done' : ''}`} onClick={() => jump(m.id)}>
            {day.done[m.id] && <Icon name="check" size={13} stroke={2.6} />}
            <span>{lang === 'ar' ? m.titleAr : m.titleEn}</span>
            <span className="chip-time">{lang === 'ar' ? m.timeLabelAr : m.timeLabelEn}</span>
          </button>
        ))}
      </nav>

      {meals.map((m) => (
        <MealSection key={m.id} meal={m} day={day} t={t} lang={lang}
          onChoose={store.choose} onToggleDone={store.toggleDone} />
      ))}

      <p className="source-note"><Icon name="info" size={16} /> {t.source}</p>
    </div>
  );
}
