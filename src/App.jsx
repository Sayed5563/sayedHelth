import { useCallback, useEffect, useRef, useState } from 'react';
import { usePlanStore } from './store.js';
import { strings } from './i18n.js';
import { applyTheme } from './themes.js';
import Icon from './components/Icon.jsx';
import DateStrip from './components/DateStrip.jsx';
import SettingsSheet from './components/SettingsSheet.jsx';
import Home from './pages/Home.jsx';
import Plan from './pages/Plan.jsx';
import Progress from './pages/Progress.jsx';
import Instructions from './pages/Instructions.jsx';

const TABS = [
  { id: 'home', icon: 'home' },
  { id: 'plan', icon: 'plan' },
  { id: 'progress', icon: 'progress' },
  { id: 'instructions', icon: 'leaf' },
];

const readHash = () => {
  const h = location.hash.replace('#', '');
  return TABS.some((x) => x.id === h) ? h : 'home';
};

const isStandalone = () => {
  try { return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch { return false; }
};

export default function App() {
  const store = usePlanStore();
  const { lang } = store;
  const t = strings[lang];
  const [tab, setTab] = useState(readHash);
  const [focus, setFocus] = useState(null);
  const [now, setNow] = useState(() => new Date());
  const [installEvt, setInstallEvt] = useState(null);
  const [installed, setInstalled] = useState(isStandalone);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Colour theme + light/dark, following the system when set to Auto.
  useEffect(() => {
    applyTheme(store.theme, store.mode);
    if (store.mode !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => applyTheme(store.theme, 'auto');
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [store.theme, store.mode]);

  useEffect(() => { if (store.saveFailed) notify(t.toast.saveFail); }, [store.saveFailed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onHash = () => setTab(readHash());
    window.addEventListener('hashchange', onHash);
    const id = setInterval(() => setNow(new Date()), 60_000);
    const onPrompt = (e) => { e.preventDefault(); setInstallEvt(e); };
    const onInstalled = () => { setInstallEvt(null); setInstalled(true); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      clearInterval(id);
    };
  }, []);

  const go = (id, mealId = null) => {
    setFocus(mealId);
    if (location.hash !== `#${id}`) location.hash = id; else setTab(id);
    if (!mealId) window.scrollTo({ top: 0 });
  };

  useEffect(() => { if (!focus) window.scrollTo({ top: 0 }); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const install = async () => {
    if (!installEvt) { notify(t.installHelp); return; }
    installEvt.prompt();
    const choice = await installEvt.userChoice.catch(() => null);
    setInstallEvt(null);
    if (choice?.outcome === 'accepted') notify(t.installed);
  };

  // Store actions wrapped with a short confirmation message.
  const actions = {
    ...store,
    choose: (mealId, idx) => { store.choose(mealId, idx); notify(t.toast.chosen); },
    toggleDone: (mealId) => {
      const wasDone = !!store.day.done[mealId];
      store.toggleDone(mealId);
      notify(wasDone ? t.toast.undone : t.toast.done);
    },
    toggleInstruction: (i) => { store.toggleInstruction(i); notify(t.toast.ins); },
    resetDay: () => { store.resetDay(); notify(t.toast.reset); },
  };

  const props = { t, lang, day: store.day, days: store.days, store: actions, go, now };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><Icon name="leaf" size={18} stroke={1.9} /></span>
          <span className="brand-text">
            <strong lang="en">{t.appName}</strong>
            <small>{t.planName}</small>
          </span>
        </div>
        <div className="top-actions">
          {!installed && (
            <button type="button" className="pill-btn" onClick={install} aria-label={t.install}>
              <Icon name="download" size={17} /> <span className="pill-btn-text">{t.install}</span>
            </button>
          )}
          <button type="button" className="icon-btn" onClick={() => setSettingsOpen(true)} aria-label={t.settings} title={t.settings}>
            <Icon name="palette" size={19} />
          </button>
          <button type="button" className="icon-btn lang-btn" onClick={() => store.setLang(lang === 'ar' ? 'en' : 'ar')}
            aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}>
            <span lang={lang === 'ar' ? 'en' : 'ar'}>{t.lang}</span>
          </button>
        </div>
      </header>

      <main key={tab} className="view">
        <DateStrip t={t} lang={lang} store={store} />
        {tab === 'home' && <Home {...props} />}
        {tab === 'plan' && <Plan {...props} focus={focus} />}
        {tab === 'progress' && <Progress {...props} />}
        {tab === 'instructions' && <Instructions {...props} />}
      </main>

      <nav className="tabbar" aria-label="Main">
        {TABS.map((x) => (
          <a key={x.id} href={`#${x.id}`} className={`tab ${tab === x.id ? 'active' : ''}`}
            aria-current={tab === x.id ? 'page' : undefined}
            onClick={(e) => { e.preventDefault(); go(x.id); }}>
            <span className="tab-icon"><Icon name={x.icon} size={22} /></span>
            <span className="tab-label">{t.nav[x.id]}</span>
          </a>
        ))}
      </nav>

      <div className="toast-wrap" role="status" aria-live="polite">
        {toast && (
          <div className="toast" key={toast.id}>
            <span className="toast-check"><Icon name="check" size={14} stroke={2.6} /></span>
            {toast.msg}
          </div>
        )}
      </div>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} t={t} lang={lang} store={store} notify={notify} />
    </div>
  );
}
