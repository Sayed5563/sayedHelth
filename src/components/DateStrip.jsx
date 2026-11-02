import Icon from './Icon.jsx';
import { keyToDate } from '../store.js';

// Move back through earlier days to review or fix them. Future days are not reachable.
export default function DateStrip({ t, lang, store }) {
  const fmt = new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <div className={`date-strip ${store.isToday ? '' : 'is-past'}`}>
      <button type="button" className="date-arrow" onClick={() => store.shiftDay(-1)} aria-label={t.prevDay}>
        <Icon name="chevron" size={18} className="flip-back" />
      </button>
      <div className="date-center">
        <span className="date-label">{store.isToday ? t.today : t.pastDay}</span>
        <span className="date-value">{fmt.format(keyToDate(store.viewKey))}</span>
        {!store.isToday && (
          <button type="button" className="date-today" onClick={store.goToday}>{t.backToToday}</button>
        )}
      </div>
      <button type="button" className="date-arrow" onClick={() => store.shiftDay(1)} aria-label={t.nextDay} disabled={store.isToday}>
        <Icon name="chevron" size={18} className="flip-fwd" />
      </button>
    </div>
  );
}
