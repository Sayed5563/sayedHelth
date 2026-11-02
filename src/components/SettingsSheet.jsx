import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import { themes } from '../themes.js';
import { resolveMode } from '../themes.js';

// Bottom sheet: colour theme, light/dark mode, language.
export default function SettingsSheet({ open, onClose, t, lang, store, notify }) {
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    panel.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const shown = resolveMode(store.mode);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="settings-title" tabIndex={-1} ref={panel}
        onClick={(e) => e.stopPropagation()}>
        <span className="sheet-grip" aria-hidden="true" />
        <header className="sheet-head">
          <h2 id="settings-title">{t.settings}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t.close}><Icon name="close" size={18} /></button>
        </header>

        <section className="sheet-section">
          <h3 className="sheet-label">{t.colours}</h3>
          <div className="swatches" role="radiogroup" aria-label={t.colours}>
            {themes.map((th) => {
              const c = th[shown];
              const on = store.theme === th.id;
              return (
                <button key={th.id} type="button" role="radio" aria-checked={on}
                  className={`swatch ${on ? 'on' : ''}`}
                  onClick={() => { if (!on) { store.setTheme(th.id); notify(t.toast.theme); } }}>
                  <span className="swatch-preview" style={{ background: c.bg, borderColor: c['line-strong'] }}>
                    <span className="sw-hero" style={{ background: c['hero-bg'] }}>
                      <span className="sw-ring" style={{ borderColor: c.ring }} />
                    </span>
                    <span className="sw-row">
                      <span style={{ background: c.primary }} />
                      <span style={{ background: c['sage-soft'] }} />
                      <span style={{ background: c['gold-soft'] }} />
                    </span>
                    {on && <span className="sw-check" style={{ background: c.ring, color: c['hero-bg'] }}><Icon name="check" size={13} stroke={3} /></span>}
                  </span>
                  <span className="swatch-name">{th[lang]}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="sheet-section">
          <h3 className="sheet-label">{t.appearance}</h3>
          <div className="segmented" role="radiogroup" aria-label={t.appearance}>
            {['auto', 'light', 'dark'].map((m) => (
              <button key={m} type="button" role="radio" aria-checked={store.mode === m}
                className={store.mode === m ? 'on' : ''} onClick={() => store.setMode(m)}>
                <Icon name={m === 'auto' ? 'contrast' : m === 'light' ? 'sun' : 'moon'} size={16} />
                {t.modes[m]}
              </button>
            ))}
          </div>
        </section>

        <section className="sheet-section">
          <h3 className="sheet-label">{t.language}</h3>
          <div className="segmented" role="radiogroup" aria-label={t.language}>
            <button type="button" role="radio" aria-checked={lang === 'ar'} className={lang === 'ar' ? 'on' : ''}
              onClick={() => store.setLang('ar')} lang="ar">العربية</button>
            <button type="button" role="radio" aria-checked={lang === 'en'} className={lang === 'en' ? 'on' : ''}
              onClick={() => store.setLang('en')} lang="en">English</button>
          </div>
        </section>
      </div>
    </div>
  );
}
