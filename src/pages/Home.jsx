import Icon from '../components/Icon.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import MealCover from '../components/MealCover.jsx';
import Ingredients from '../components/Ingredients.jsx';
import { meals, optionLabelsAr, optionLabelsEn } from '../data/plan.js';

function greetingKey(h) { return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'; }

export default function Home({ t, lang, day, go, now, store }) {
  const doneCount = meals.filter((m) => day.done[m.id]).length;
  const pct = doneCount / meals.length;
  const next = meals.find((m) => !day.done[m.id]);
  const nextSel = next ? day.sel[next.id] : undefined;
  const labels = lang === 'ar' ? optionLabelsAr : optionLabelsEn;

  return (
    <div className="page page-home">
      <header className="hello">
        <p className="eyebrow"><Icon name="spark" size={15} /> {t.heroTag}</p>
        <h1>{store.isToday ? t.greeting[greetingKey(now.getHours())] : t.pastDayTitle}</h1>
        <p className="hello-line">{t.heroLine1} <em>{t.heroLine2}</em></p>
        <span className="cal-pill"><span className="cal-dot" aria-hidden="true" />{t.calPill}</span>
      </header>

      <section className="hero-card" aria-label={store.isToday ? t.todayProgress : t.dayProgress}>
        <ProgressRing value={pct} size={128}>
          <strong className="ring-num">{Math.round(pct * 100)}<small>%</small></strong>
        </ProgressRing>
        <div className="hero-text">
          <p className="eyebrow eyebrow-light">{store.isToday ? t.todayProgress : t.dayProgress}</p>
          <p className="hero-big">{t.mealsDone(doneCount, meals.length)}</p>
          <div className="dots" aria-hidden="true">
            {meals.map((m) => <span key={m.id} className={`dot ${day.done[m.id] ? 'on' : day.sel[m.id] !== undefined ? 'half' : ''}`} />)}
          </div>
        </div>
      </section>

      {next ? (
        <section className="next-card">
          <div className="next-top">
            <MealCover meal={next} size="sm" />
            <div>
              <p className="eyebrow">{t.nextMeal} · {lang === 'ar' ? next.timeLabelAr : next.timeLabelEn}</p>
              <h2>{lang === 'ar' ? next.titleAr : next.titleEn}</h2>
            </div>
          </div>
          {nextSel !== undefined ? (
            <div className="next-choice">
              <p className="mini-label">{t.yourChoice}: {labels[nextSel]}</p>
              <Ingredients text={next.options[nextSel]} />
            </div>
          ) : (
            <p className="muted">{t.notChosen} · {t.options(next.options.length)}</p>
          )}
          <button type="button" className="btn btn-primary" onClick={() => go('plan', next.id)}>
            {nextSel !== undefined ? t.viewPlan : t.chooseOption}
          </button>
        </section>
      ) : (
        <section className="next-card celebrate">
          <span className="seal"><Icon name="check" size={28} stroke={2.2} /></span>
          <h2>{t.allDone}</h2>
          <p className="muted">{t.allDoneSub}</p>
        </section>
      )}

      <section>
        <h3 className="section-title">{t.todayMeals}</h3>
        <ol className="timeline">
          {meals.map((m) => {
            const s = day.sel[m.id];
            const done = day.done[m.id];
            return (
              <li key={m.id}>
                <button type="button" className={`tl-row ${done ? 'done' : ''}`} onClick={() => go('plan', m.id)}>
                  <span className="tl-time">{lang === 'ar' ? m.timeLabelAr : m.timeLabelEn}</span>
                  <span className={`tl-dot ${done ? 'on' : s !== undefined ? 'half' : ''}`} aria-hidden="true">
                    {done && <Icon name="check" size={12} stroke={3} />}
                  </span>
                  <span className="tl-main">
                    <span className="tl-title">{lang === 'ar' ? m.titleAr : m.titleEn}</span>
                    <span className="tl-sub">{s !== undefined ? labels[s] : t.notChosen}</span>
                  </span>
                  <Icon name="chevron" size={16} className="tl-chev" />
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <button type="button" className="plate-card" onClick={() => go('instructions')}>
        <img src={`${import.meta.env.BASE_URL}plate.jpg`} alt="My Healthy Plate: ½ vegetables, ¼ protein, ¼ starch" width="643" height="698" />
        <span>
          <span className="eyebrow">{t.nav.instructions}</span>
          <strong>{t.plateTitle}</strong>
          <span className="muted small">{t.plateSub}</span>
        </span>
      </button>
    </div>
  );
}
