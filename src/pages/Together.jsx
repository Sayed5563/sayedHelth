import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import { meals, instructions, optionLabelsAr, optionLabelsEn } from '../data/plan.js';
import { todayKey } from '../store.js';

function lastDays(n) {
  return Array.from({ length: n }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (n - 1 - i)); return d; });
}

function streakOf(days) {
  // Full days in a row, counted back from today (today may still be in progress).
  let n = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const r = days[todayKey(d)];
    if (r && r.meals_done >= meals.length) n++;
    else if (i === 0) continue;
    else break;
  }
  return n;
}

function AuthForm({ T, account, notify }) {
  const [mode, setMode] = useState('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const res = mode === 'signUp'
      ? await account.signUp(name.trim(), email.trim(), password)
      : await account.signIn(email.trim(), password);
    setBusy(false);
    if (!res.ok) { setMsg({ kind: 'error', text: T.errors[res.error] || T.errors.generic }); return; }
    if (res.value === 'confirm_email') { setMsg({ kind: 'info', text: T.confirmEmail }); setMode('signIn'); return; }
    notify(T.synced);
  };

  return (
    <form className="card auth" onSubmit={submit} noValidate={false}>
      <h2 className="card-title">{mode === 'signUp' ? T.signUpTitle : T.signInTitle}</h2>
      <p className="muted small">{T.why}</p>
      {mode === 'signUp' && (
        <label className="field" htmlFor="tg-name">
          <span>{T.name}</span>
          <input id="tg-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={T.namePh}
            required maxLength={40} autoComplete="nickname" />
        </label>
      )}
      <label className="field" htmlFor="tg-email">
        <span>{T.email}</span>
        <input id="tg-email" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)}
          required autoComplete="email" inputMode="email" />
      </label>
      <label className="field" htmlFor="tg-pass">
        <span>{T.password}</span>
        <input id="tg-pass" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)}
          required minLength={6} autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'} />
        {mode === 'signUp' && <small className="muted">{T.passwordHint}</small>}
      </label>
      {msg && <p className={`form-msg ${msg.kind}`} role="alert">{msg.text}</p>}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? '…' : mode === 'signUp' ? T.signUp : T.signIn}
      </button>
      <button type="button" className="link-btn" onClick={() => { setMode(mode === 'signUp' ? 'signIn' : 'signUp'); setMsg(null); }}>
        {mode === 'signUp' ? T.toSignIn : T.toSignUp}
      </button>
    </form>
  );
}

function PersonCard({ person, T, t, lang, account, notify }) {
  const [confirm, setConfirm] = useState(false);
  const today = person.days[todayKey()];
  const mealsDone = today?.meals_done || 0;
  const insDone = today?.ins_done || 0;
  const labels = lang === 'ar' ? optionLabelsAr : optionLabelsEn;
  const week = lastDays(7).map((d) => ({ d, n: person.days[todayKey(d)]?.meals_done || 0, today: todayKey(d) === todayKey() }));
  const updated = today?.updated_at ? new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en-GB', { hour: 'numeric', minute: '2-digit' }).format(new Date(today.updated_at)) : null;

  return (
    <article className="person card">
      <header className="person-head">
        <span className="avatar" aria-hidden="true">{person.display_name.trim().charAt(0).toUpperCase()}</span>
        <div className="person-name">
          <h3>{person.display_name}</h3>
          <small className="muted">{updated ? `${T.updated} ${updated}` : T.noToday}</small>
        </div>
        <ProgressRing value={mealsDone / meals.length} size={58} stroke={6}>
          <strong className="ring-small">{mealsDone}/{meals.length}</strong>
        </ProgressRing>
      </header>

      <dl className="person-stats">
        <div><dt>{T.todayMeals}</dt><dd>{mealsDone}<span>/{meals.length}</span></dd></div>
        <div><dt>{T.habits}</dt><dd>{insDone}<span>/{instructions.length}</span></dd></div>
        <div><dt>{T.streak}</dt><dd>{streakOf(person.days)}</dd></div>
      </dl>

      <div className="mini-week" role="img" aria-label={week.map((w) => `${t.weekdays[w.d.getDay()]} ${w.n}/5`).join(', ')}>
        {week.map((w, i) => (
          <span key={i} className={`mw ${w.today ? 'today' : ''}`}>
            <span className="mw-track"><span className="mw-fill" style={{ height: `${(w.n / meals.length) * 100}%` }} /></span>
            <span className="mw-day">{t.weekdays[w.d.getDay()]}</span>
          </span>
        ))}
      </div>

      <ul className="person-meals">
        {meals.map((m) => {
          const done = today?.done?.[m.id];
          const s = today?.sel?.[m.id];
          return (
            <li key={m.id} className={done ? 'done' : ''}>
              <span className="pm-dot" aria-hidden="true">{done && <Icon name="check" size={11} stroke={3} />}</span>
              <span className="pm-name">{lang === 'ar' ? m.titleAr : m.titleEn}</span>
              <span className="pm-sel">{person.share_choices ? (s !== undefined ? labels[s] : '—') : ''}</span>
            </li>
          );
        })}
      </ul>
      {!person.share_choices && <p className="muted small">{T.choicesHidden}</p>}

      <div className="person-foot">
        {!confirm ? (
          <button type="button" className="link-btn danger" onClick={() => setConfirm(true)}>{T.remove}</button>
        ) : (
          <div className="confirm">
            <span className="small">{T.removeConfirm(person.display_name)}</span>
            <button type="button" className="btn btn-danger" onClick={async () => {
              const r = await account.disconnect(person.id);
              notify(r.ok ? T.removed : T.errors[r.error]);
            }}>{T.remove}</button>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirm(false)}>{t.cancel}</button>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Together({ t, lang, account, notify }) {
  const T = t.together;
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [shareOn, setShareOn] = useState(!!account.profile?.share_choices);
  useEffect(() => { setShareOn(!!account.profile?.share_choices); }, [account.profile?.share_choices]);

  // Keep friends' progress fresh while this page is open.
  useEffect(() => {
    if (account.status !== 'signedIn') return undefined;
    account.refresh();
    const id = setInterval(() => account.refresh(), 60_000);
    return () => clearInterval(id);
  }, [account.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const head = (
    <header className="page-head">
      <p className="eyebrow"><Icon name="users" size={15} /> {t.appName}</p>
      <h1>{T.title}</h1>
      <p className="muted">{T.sub}</p>
    </header>
  );

  if (account.status === 'off') {
    return (
      <div className="page">
        {head}
        <section className="card notice">
          <span className="notice-icon"><Icon name="users" size={22} /></span>
          <h2 className="card-title">{T.offTitle}</h2>
          <p className="muted">{T.offText}</p>
        </section>
      </div>
    );
  }

  if (account.status === 'loading') {
    return <div className="page">{head}<div className="card skeleton" aria-busy="true" /></div>;
  }

  if (account.status === 'dbMissing') {
    return (
      <div className="page">
        {head}
        <section className="card notice">
          <span className="notice-icon"><Icon name="info" size={22} /></span>
          <h2 className="card-title">{T.dbMissingTitle}</h2>
          <p className="muted">{T.dbMissingText}</p>
          <button type="button" className="btn btn-ghost" onClick={() => account.signOut()}>{T.signOut}</button>
        </section>
      </div>
    );
  }

  if (account.status !== 'signedIn') {
    return <div className="page">{head}<AuthForm T={T} account={account} notify={notify} /></div>;
  }

  const p = account.profile;

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(p.invite_code); notify(T.copied); } catch { /* clipboard blocked */ }
  };
  const shareCode = async () => {
    try { await navigator.share({ text: T.shareText(p.invite_code) }); } catch { copyCode(); }
  };
  const add = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    const r = await account.connect(code);
    setBusy(false);
    if (r.ok) { setCode(''); notify(T.added(r.value.display_name)); } else notify(T.errors[r.error] || T.errors.generic);
  };

  return (
    <div className="page page-together">
      {head}

      <section className="code-card">
        <p className="eyebrow eyebrow-light">{T.myCode}</p>
        <p className="code" dir="ltr" lang="en">{p?.invite_code || '······'}</p>
        <p className="code-help">{T.codeHelp}</p>
        <div className="code-actions">
          <button type="button" className="btn btn-on-hero" onClick={shareCode} disabled={!p}><Icon name="share" size={18} /> {T.share}</button>
          <button type="button" className="btn btn-on-hero ghost" onClick={copyCode} disabled={!p}><Icon name="copy" size={18} /> {T.copy}</button>
        </div>
      </section>

      <form className="card add-form" onSubmit={add}>
        <label className="field" htmlFor="tg-code">
          <span>{T.addTitle}</span>
          <span className="add-row">
            <input id="tg-code" dir="ltr" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={T.addPh} maxLength={6} autoCapitalize="characters" autoComplete="off" spellCheck={false} />
            <button type="submit" className="btn btn-primary" disabled={busy || code.trim().length < 6}>{T.add}</button>
          </span>
        </label>
      </form>

      <section className="people">
        <div className="people-head">
          <h2 className="section-title">{T.people}</h2>
          <button type="button" className="link-btn" onClick={async () => { const r = await account.refresh(); if (!r.ok) notify(T.errors[r.error]); }}>
            <Icon name="refresh" size={16} /> {T.refresh}
          </button>
        </div>
        {account.friends.length === 0
          ? <p className="card muted">{T.nobody}</p>
          : account.friends.map((f) => <PersonCard key={f.id} person={f} T={T} t={t} lang={lang} account={account} notify={notify} />)}
      </section>

      <section className="card account">
        <h2 className="card-title">{T.settingsTitle}</h2>
        <p className="muted small">{T.signedInAs} <strong>{p?.display_name}</strong> · <span dir="ltr">{account.user?.email}</span></p>
        <label className="switch-row" htmlFor="tg-share">
          <span>
            <strong>{T.shareChoices}</strong>
            <small className="muted">{T.shareChoicesHelp}</small>
          </span>
          <input id="tg-share" type="checkbox" role="switch" className="switch" checked={shareOn}
            onChange={async (e) => {
              const on = e.target.checked;
              setShareOn(on);
              const r = await account.setShareChoices(on);
              if (!r.ok) { setShareOn(!on); notify(T.errors[r.error]); }
            }} />
        </label>
        <div className="account-actions">
          <button type="button" className="btn btn-ghost" onClick={async () => { const r = await account.newCode(); if (!r.ok) notify(T.errors[r.error]); }}>
            <Icon name="refresh" size={16} /> {T.newCode}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => account.signOut()}>{T.signOut}</button>
        </div>
        <p className="muted small">{T.newCodeHelp}</p>
      </section>
    </div>
  );
}
