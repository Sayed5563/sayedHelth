import { useCallback, useEffect, useState } from 'react';

const KEY = 'hooreya-plan-v1'; // kept so existing saved progress carries over after the rename
const MAX_BACK_DAYS = 60;

export function todayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
}

const empty = () => ({ sel: {}, done: {}, ins: {} });

const MODES = ['auto', 'light', 'dark'];

export function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || '{}');
    return {
      lang: s.lang === 'en' ? 'en' : 'ar',
      theme: typeof s.theme === 'string' ? s.theme : 'forest',
      mode: MODES.includes(s.mode) ? s.mode : 'auto',
      days: s.days && typeof s.days === 'object' ? s.days : {},
    };
  } catch {
    return { lang: 'ar', theme: 'forest', mode: 'auto', days: {} };
  }
}

function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch { return false; }
}

// One hook owns all persisted state: settings plus a record per calendar day.
// `viewKey` is the day being shown — today by default, or an earlier day picked in the date strip.
export function usePlanStore() {
  const [state, setState] = useState(loadSettings);
  const [today, setToday] = useState(todayKey);
  const [viewKey, setViewKey] = useState(todayKey);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => { setSaveFailed(!save(state)); }, [state]);

  // Roll over at midnight or when the app is reopened on a new day.
  useEffect(() => {
    const check = () => {
      const k = todayKey();
      setToday((prev) => {
        if (prev !== k) setViewKey((v) => (v === prev ? k : v));
        return k;
      });
    };
    const id = setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', check); };
  }, []);

  const day = { ...empty(), ...(state.days[viewKey] || {}) };

  const updateDay = useCallback((fn) => {
    setState((s) => {
      const cur = { ...empty(), ...(s.days[viewKey] || {}) };
      const next = fn(cur);
      if (next === cur) return s;
      return { ...s, days: { ...s.days, [viewKey]: { ...next, t: Date.now() } } };
    });
  }, [viewKey]);

  const choose = (mealId, idx) => updateDay((d) => ({ ...d, sel: { ...d.sel, [mealId]: idx } }));

  const toggleDone = (mealId) =>
    updateDay((d) => {
      if (d.sel[mealId] === undefined && !d.done[mealId]) return d;
      const done = { ...d.done };
      if (done[mealId]) delete done[mealId]; else done[mealId] = true;
      return { ...d, done };
    });

  const toggleInstruction = (i) =>
    updateDay((d) => {
      const ins = { ...d.ins };
      if (ins[i]) delete ins[i]; else ins[i] = true;
      return { ...d, ins };
    });

  const resetDay = () => updateDay(() => empty());

  const shiftDay = (delta) => {
    const d = keyToDate(viewKey);
    d.setDate(d.getDate() + delta);
    const k = todayKey(d);
    const min = keyToDate(today); min.setDate(min.getDate() - MAX_BACK_DAYS);
    if (k > today || d < min) return;
    setViewKey(k);
  };

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  // Merge days downloaded from the cloud: the newer copy of each day wins.
  // A cloud copy without meal choices (sharing off) keeps the choices stored on this phone.
  const mergeRemote = useCallback((remote) => {
    setState((s) => {
      let changed = false;
      const days = { ...s.days };
      Object.entries(remote).forEach(([k, r]) => {
        const local = days[k];
        if (!local || (local.t || 0) < r.t) {
          days[k] = { sel: r.sel ?? local?.sel ?? {}, done: r.done, ins: r.ins, t: r.t };
          changed = true;
        }
      });
      return changed ? { ...s, days } : s;
    });
  }, []);

  // Used when a different account signs in on this phone: its days come from the cloud instead.
  const clearDays = useCallback(() => setState((s) => ({ ...s, days: {} })), []);

  return {
    lang: state.lang, theme: state.theme, mode: state.mode,
    setLang: (lang) => set({ lang }), setTheme: (theme) => set({ theme }), setMode: (mode) => set({ mode }),
    todayKey: today, viewKey, isToday: viewKey === today, shiftDay, goToday: () => setViewKey(today),
    day, days: state.days, saveFailed,
    choose, toggleDone, toggleInstruction, resetDay, mergeRemote, clearDays,
  };
}
