import { useCallback, useEffect, useRef, useState } from 'react';
import { getClient, syncConfigured } from './client.js';
import { meals, instructions } from '../data/plan.js';
import { todayKey } from '../store.js';

const HISTORY_DAYS = 7;
const LAST_USER_KEY = 'sayedhelth-last-user';

function daysAgoKey(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return todayKey(d);
}

export function toRow(userId, key, rec, shareChoices) {
  const done = rec.done || {};
  const ins = rec.ins || {};
  return {
    user_id: userId,
    day: key,
    meals_done: meals.filter((m) => done[m.id]).length,
    ins_done: instructions.filter((_, i) => ins[i]).length,
    done,
    ins,
    sel: shareChoices ? (rec.sel || {}) : null,
    updated_at: new Date(rec.t || Date.now()).toISOString(),
  };
}

export function fromRow(row) {
  return { sel: row.sel || null, done: row.done || {}, ins: row.ins || {}, t: Date.parse(row.updated_at) || 0 };
}

const friendlyError = (e) => {
  const m = String(e?.message || e || '');
  if (/code_not_found/.test(m)) return 'code_not_found';
  if (/own_code/.test(m)) return 'own_code';
  if (/Invalid login credentials/i.test(m)) return 'bad_login';
  if (/already registered|already been registered/i.test(m)) return 'exists';
  if (/Email not confirmed/i.test(m)) return 'not_confirmed';
  if (/Password should be/i.test(m)) return 'weak_password';
  if (/fetch|network|Failed to/i.test(m)) return 'offline';
  return 'generic';
};

// Account, connections and cloud copy of the user's own days.
// `onRemoteDays(map)` is called with the user's own rows from the server so the store can merge them.
export function useAccount({ onRemoteDays, onSwitchUser }) {
  const [status, setStatus] = useState(syncConfigured ? 'loading' : 'off');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const remoteCb = useRef(onRemoteDays);
  remoteCb.current = onRemoteDays;
  const switchCb = useRef(onSwitchUser);
  switchCb.current = onSwitchUser;

  const loadFriends = useCallback(async () => {
    const sb = await getClient();
    if (!sb) return;
    const { data: links, error } = await sb.from('connections').select('friend_id');
    if (error) throw error;
    const ids = (links || []).map((l) => l.friend_id);
    if (!ids.length) { setFriends([]); return; }
    const [{ data: profs, error: e1 }, { data: rows, error: e2 }] = await Promise.all([
      sb.from('profiles').select('id, display_name, share_choices').in('id', ids),
      sb.from('daily_progress').select('*').in('user_id', ids).gte('day', daysAgoKey(HISTORY_DAYS - 1)),
    ]);
    if (e1) throw e1;
    if (e2) throw e2;
    setFriends((profs || []).map((p) => ({
      ...p,
      days: Object.fromEntries((rows || []).filter((r) => r.user_id === p.id).map((r) => [r.day, r])),
    })).sort((a, b) => a.display_name.localeCompare(b.display_name)));
  }, []);

  const afterSignIn = useCallback(async (u) => {
    const sb = await getClient();
    // This phone's saved days belong to whoever signed in here before. If someone else signs in,
    // start from their cloud copy instead of mixing the two.
    try {
      const last = localStorage.getItem(LAST_USER_KEY);
      if (last && last !== u.id) switchCb.current?.();
      localStorage.setItem(LAST_USER_KEY, u.id);
    } catch { /* storage unavailable */ }
    setUser(u);
    setStatus('signedIn');
    const { data: prof, error } = await sb.rpc('ensure_profile', { name: u.user_metadata?.display_name || null });
    if (error) throw error;
    setProfile(prof);
    const { data: own } = await sb.from('daily_progress').select('*').eq('user_id', u.id).gte('day', daysAgoKey(60));
    if (own?.length) remoteCb.current(Object.fromEntries(own.map((r) => [r.day, fromRow(r)])));
    await loadFriends();
    setLastSync(new Date());
  }, [loadFriends]);

  useEffect(() => {
    if (!syncConfigured) return undefined;
    let sub;
    let cancelled = false;
    getClient().then(async (sb) => {
      const { data } = await sb.auth.getSession();
      if (cancelled) return;
      if (data.session?.user) afterSignIn(data.session.user).catch(() => setStatus('signedIn'));
      else setStatus('signedOut');
      sub = sb.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') { setUser(null); setProfile(null); setFriends([]); setStatus('signedOut'); }
      }).data.subscription;
    }).catch(() => setStatus('signedOut'));
    return () => { cancelled = true; sub?.unsubscribe(); };
  }, [afterSignIn]);

  const run = async (fn) => {
    try { return { ok: true, value: await fn(await getClient()) }; } catch (e) { return { ok: false, error: friendlyError(e) }; }
  };

  const signUp = (name, email, password) => run(async (sb) => {
    const { data, error } = await sb.auth.signUp({ email, password, options: { data: { display_name: name } } });
    if (error) throw error;
    if (!data.session) return 'confirm_email';
    await afterSignIn(data.session.user);
    return 'signed_in';
  });

  const signIn = (email, password) => run(async (sb) => {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await afterSignIn(data.user);
  });

  const signOut = () => run(async (sb) => { await sb.auth.signOut(); });

  const connect = (code) => run(async (sb) => {
    const { data, error } = await sb.rpc('connect_with_code', { code });
    if (error) throw error;
    await loadFriends();
    return data;
  });

  const disconnect = (id) => run(async (sb) => {
    const { error } = await sb.rpc('disconnect', { other: id });
    if (error) throw error;
    await loadFriends();
  });

  const newCode = () => run(async (sb) => {
    const { data, error } = await sb.rpc('new_invite_code');
    if (error) throw error;
    setProfile((p) => ({ ...p, invite_code: data }));
  });

  const rename = (name) => run(async (sb) => {
    const { data, error } = await sb.rpc('ensure_profile', { name });
    if (error) throw error;
    setProfile(data);
  });

  const setShareChoices = (on) => run(async (sb) => {
    const { data, error } = await sb.from('profiles').update({ share_choices: on, updated_at: new Date().toISOString() })
      .eq('id', user.id).select().single();
    if (error) throw error;
    setProfile(data);
  });

  const refresh = () => run(async () => { await loadFriends(); setLastSync(new Date()); });

  // Upload changed days. Returns true when the server has them.
  const pushDays = useCallback(async (entries) => {
    if (!user || !profile || !entries.length) return true;
    const sb = await getClient();
    const rows = entries.map(([key, rec]) => toRow(user.id, key, rec, profile.share_choices));
    const { error } = await sb.from('daily_progress').upsert(rows, { onConflict: 'user_id,day' });
    if (error) return false;
    setLastSync(new Date());
    return true;
  }, [user, profile]);

  return {
    configured: syncConfigured, status, user, profile, friends, lastSync,
    signUp, signIn, signOut, connect, disconnect, newCode, rename, setShareChoices, refresh, pushDays,
  };
}
