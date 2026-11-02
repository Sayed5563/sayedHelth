// Small hand-drawn stroke icon set, 24px grid, inherits currentColor.
const paths = {
  home: <><path d="M4 10.5 12 4l8 6.5" /><path d="M6 9.5V19a1 1 0 0 0 1 1h3.5v-5h3v5H17a1 1 0 0 0 1-1V9.5" /></>,
  plan: <><rect x="4.5" y="4.5" width="15" height="16" rx="3" /><path d="M8.5 3v3M15.5 3v3M8 11h8M8 15h5" /></>,
  progress: <><path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5" /><path d="M12 3.5V12l6 6" /></>,
  leaf: <><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" /><path d="M5 19 13 11" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  sunrise: <><path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0" /><path d="M12 5v3M5.2 9.2l2 2M18.8 9.2l-2 2" /></>,
  apple: <><path d="M12 7.5c-2-1.5-6-1-6.5 3.5-.4 4 2.5 8.5 4.5 8.5 1 0 1.3-.5 2-.5s1 .5 2 .5c2 0 4.9-4.5 4.5-8.5-.5-4.5-4.5-5-6.5-3.5Z" /><path d="M12 7.5C12 5.5 13 4 15 3.5" /></>,
  plate: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.5" /></>,
  cup: <><path d="M5 8h12v4a6 6 0 0 1-12 0V8Z" /><path d="M17 9.5h1.5a2 2 0 0 1 0 4H17M8 4.5c0 1 1 1 1 2M12 4.5c0 1 1 1 1 2" /></>,
  moon: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z" />,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 3 2.5 14 0 17M12 3.5c-2.5 3-2.5 14 0 17" /></>,
  download: <><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></>,
  flame: <path d="M12 20c-3.5 0-6-2.3-6-5.6 0-3.6 3.2-5.3 3.6-9.4 2.5 1.6 3.6 3.7 3.6 5.6 1-.6 1.6-1.8 1.8-2.8 1.6 1.4 3 3.6 3 6.6 0 3.3-2.5 5.6-6 5.6Z" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  users: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" /><circle cx="16.5" cy="9.5" r="2.6" /><path d="M16 14.2c2.4.1 4 1.7 4.5 4.3" /></>,
  share: <><path d="M12 15V4M8 7.5 12 3.5l4 4" /><path d="M6 11v7.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V11" /></>,
  copy: <><rect x="8.5" y="8.5" width="11" height="11" rx="2.5" /><path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>,
  contrast: <><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17Z" fill="currentColor" /></>,
  palette: <><path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.1-.9-1.4-.9-2.4 0-1 .8-1.6 1.8-1.6h2.1a3.7 3.7 0 0 0 3.7-3.7c0-4.3-3.8-7.6-8.5-7.6Z" /><circle cx="7.8" cy="11" r="1.1" fill="currentColor" /><circle cx="10.5" cy="7.4" r="1.1" fill="currentColor" /><circle cx="15" cy="7.6" r="1.1" fill="currentColor" /></>,
  spark: <><path d="m12 3.5 1.6 5.4 5.4 1.6-5.4 1.6L12 17.5l-1.6-5.4L5 10.5l5.4-1.6L12 3.5Z" /><path d="M18.5 15.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9Z" /></>,
  refresh: <><path d="M19 12a7 7 0 1 1-2-4.9" /><path d="M19 4.5V8h-3.5" /></>,
};

export default function Icon({ name, size = 22, stroke = 1.7, className = '' }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
