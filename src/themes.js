// Colour themes. Each has a light and a dark set of the same tokens used in styles.css.
// The chosen theme is applied as inline CSS variables on <html> (see applyTheme).

const T = (o) => o;

export const themes = [
  {
    id: 'forest',
    ar: 'غابة وذهب', en: 'Forest & Gold',
    light: T({
      bg: '#FAF6EE', surface: '#FFFDF8', 'surface-2': '#F3EDE0', ink: '#1C2A22', muted: '#69736B',
      line: 'rgba(31,61,47,.10)', 'line-strong': 'rgba(31,61,47,.20)',
      primary: '#1F3D2F', 'primary-hover': '#2A4F3D', 'on-primary': '#FBF7EE', accent: '#2F5A45',
      sage: '#9FB69A', 'sage-soft': '#DDE6D6', gold: '#B48A3E', 'gold-soft': '#EBDDBC',
      paper: '#FFFDF8', 'cover-bg': '#E6ECDD', 'hero-bg': '#1F3D2F', 'hero-ink': '#F6F0E2', ring: '#C9A35A',
    }),
    dark: T({
      bg: '#111915', surface: '#18221C', 'surface-2': '#1E2A23', ink: '#EDE7DA', muted: '#9AA59C',
      line: 'rgba(220,230,215,.09)', 'line-strong': 'rgba(220,230,215,.18)',
      primary: '#C9D9C1', 'primary-hover': '#DAE6D3', 'on-primary': '#14201A', accent: '#B7CDAF',
      sage: '#7E9877', 'sage-soft': '#26362C', gold: '#D2AE68', 'gold-soft': '#4A3F27',
      paper: '#2B3A30', 'cover-bg': '#1F2D24', 'hero-bg': '#1C3327', 'hero-ink': '#F1EBDD', ring: '#D8B56C',
    }),
  },
  {
    id: 'sage',
    ar: 'حديقة المريمية', en: 'Sage Garden',
    light: T({
      bg: '#F6F7F1', surface: '#FFFFFB', 'surface-2': '#ECEFE4', ink: '#22291F', muted: '#6C7466',
      line: 'rgba(60,80,55,.10)', 'line-strong': 'rgba(60,80,55,.20)',
      primary: '#4E6B4A', 'primary-hover': '#5B7B56', 'on-primary': '#FAFBF5', accent: '#4E6B4A',
      sage: '#A8BE9C', 'sage-soft': '#E1EAD8', gold: '#A98B4F', 'gold-soft': '#ECE2C6',
      paper: '#FFFFFB', 'cover-bg': '#E4EBDB', 'hero-bg': '#6F8C68', 'hero-ink': '#FBFCF6', ring: '#F1DCA4',
    }),
    dark: T({
      bg: '#131711', surface: '#1A1F18', 'surface-2': '#222920', ink: '#E9EDE2', muted: '#9DA696',
      line: 'rgba(225,234,216,.09)', 'line-strong': 'rgba(225,234,216,.18)',
      primary: '#BFD4B2', 'primary-hover': '#CFE0C4', 'on-primary': '#161C14', accent: '#B9CEAC',
      sage: '#82997A', 'sage-soft': '#2A3527', gold: '#D3B878', 'gold-soft': '#463E28',
      paper: '#2E382B', 'cover-bg': '#222B20', 'hero-bg': '#33452F', 'hero-ink': '#F0F3E9', ring: '#E6CD8A',
    }),
  },
  {
    id: 'rose',
    ar: 'وردي ترابي', en: 'Rose Clay',
    light: T({
      bg: '#FBF5F2', surface: '#FFFCFA', 'surface-2': '#F4E9E4', ink: '#2E2023', muted: '#7A6A6C',
      line: 'rgba(110,50,60,.10)', 'line-strong': 'rgba(110,50,60,.20)',
      primary: '#6E3440', 'primary-hover': '#7F414D', 'on-primary': '#FFF7F4', accent: '#8A4653',
      sage: '#D3A8A6', 'sage-soft': '#F2E0DC', gold: '#B07F4E', 'gold-soft': '#F0DFC8',
      paper: '#FFFCFA', 'cover-bg': '#F1E2DD', 'hero-bg': '#6E3440', 'hero-ink': '#FCEFEA', ring: '#E5B58A',
    }),
    dark: T({
      bg: '#181213', surface: '#21181A', 'surface-2': '#2A1F21', ink: '#F2E6E4', muted: '#AE9C9E',
      line: 'rgba(242,224,220,.09)', 'line-strong': 'rgba(242,224,220,.18)',
      primary: '#EBC3C4', 'primary-hover': '#F3D2D2', 'on-primary': '#24171A', accent: '#E8B9BA',
      sage: '#A07477', 'sage-soft': '#3A2629', gold: '#DDAE7F', 'gold-soft': '#4B3626',
      paper: '#3A2A2D', 'cover-bg': '#2C1F21', 'hero-bg': '#4A2530', 'hero-ink': '#FBEDEA', ring: '#E9BA8F',
    }),
  },
  {
    id: 'ocean',
    ar: 'أزرق المحيط', en: 'Ocean Teal',
    light: T({
      bg: '#F3F6F6', surface: '#FCFEFE', 'surface-2': '#E6EEEF', ink: '#172629', muted: '#627377',
      line: 'rgba(20,70,80,.10)', 'line-strong': 'rgba(20,70,80,.20)',
      primary: '#154452', 'primary-hover': '#1D5465', 'on-primary': '#F3FAFB', accent: '#1E5A6B',
      sage: '#8FB8BE', 'sage-soft': '#D7E8EA', gold: '#B0864A', 'gold-soft': '#EEDFC4',
      paper: '#FCFEFE', 'cover-bg': '#DDEBEC', 'hero-bg': '#154452', 'hero-ink': '#EEF7F8', ring: '#E8C27C',
    }),
    dark: T({
      bg: '#0F1618', surface: '#152024', 'surface-2': '#1B292D', ink: '#E4EEF0', muted: '#93A6AA',
      line: 'rgba(215,232,234,.09)', 'line-strong': 'rgba(215,232,234,.18)',
      primary: '#AFD4DA', 'primary-hover': '#C2E0E5', 'on-primary': '#10202A', accent: '#A6CDD3',
      sage: '#6E979D', 'sage-soft': '#213539', gold: '#D9B172', 'gold-soft': '#463A27',
      paper: '#26393E', 'cover-bg': '#1B2B2F', 'hero-bg': '#173A45', 'hero-ink': '#EAF4F5', ring: '#E5C07D',
    }),
  },
  {
    id: 'plum',
    ar: 'برقوقي', en: 'Plum',
    light: T({
      bg: '#F8F5F8', surface: '#FFFDFF', 'surface-2': '#EFE8EF', ink: '#261E2A', muted: '#736A77',
      line: 'rgba(70,40,80,.10)', 'line-strong': 'rgba(70,40,80,.20)',
      primary: '#45294F', 'primary-hover': '#55355F', 'on-primary': '#FBF6FC', accent: '#5C3B68',
      sage: '#BBA6C2', 'sage-soft': '#EAE0EC', gold: '#A87E52', 'gold-soft': '#EEDFCB',
      paper: '#FFFDFF', 'cover-bg': '#EBE2EC', 'hero-bg': '#45294F', 'hero-ink': '#F8F0F9', ring: '#E2B48E',
    }),
    dark: T({
      bg: '#151217', surface: '#1D1820', 'surface-2': '#251F29', ink: '#EEE6F0', muted: '#A69CAA',
      line: 'rgba(234,224,236,.09)', 'line-strong': 'rgba(234,224,236,.18)',
      primary: '#D9C3E0', 'primary-hover': '#E5D3EA', 'on-primary': '#1E1622', accent: '#D2BADB',
      sage: '#8C7895', 'sage-soft': '#33293A', gold: '#D8AE82', 'gold-soft': '#463728',
      paper: '#352B3A', 'cover-bg': '#271F2B', 'hero-bg': '#3A2443', 'hero-ink': '#F6EDF8', ring: '#E3B892',
    }),
  },
  {
    id: 'olive',
    ar: 'زيتوني وطيني', en: 'Olive & Terracotta',
    light: T({
      bg: '#F8F5EC', surface: '#FFFDF6', 'surface-2': '#EFEADB', ink: '#29271B', muted: '#736F5E',
      line: 'rgba(70,65,30,.11)', 'line-strong': 'rgba(70,65,30,.21)',
      primary: '#4A4826', 'primary-hover': '#5A5830', 'on-primary': '#FBF9EF', accent: '#5B5930',
      sage: '#B5B48A', 'sage-soft': '#E7E6D2', gold: '#B4673F', 'gold-soft': '#F1DCCB',
      paper: '#FFFDF6', 'cover-bg': '#E9E6D4', 'hero-bg': '#4A4826', 'hero-ink': '#FAF6E8', ring: '#D9875D',
    }),
    dark: T({
      bg: '#15140F', surface: '#1D1C15', 'surface-2': '#25241B', ink: '#EDEAD9', muted: '#A5A18D',
      line: 'rgba(231,230,210,.09)', 'line-strong': 'rgba(231,230,210,.18)',
      primary: '#D6D4A9', 'primary-hover': '#E2E0BA', 'on-primary': '#1C1B12', accent: '#CFCC9F',
      sage: '#8B8A63', 'sage-soft': '#302F22', gold: '#DE9670', 'gold-soft': '#4B3326',
      paper: '#37352A', 'cover-bg': '#26251C', 'hero-bg': '#3A391E', 'hero-ink': '#F7F3E3', ring: '#E39A72',
    }),
  },
];

export const themeById = (id) => themes.find((t) => t.id === id) || themes[0];

export function resolveMode(mode) {
  if (mode === 'light' || mode === 'dark') return mode;
  try { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } catch { return 'light'; }
}

export function applyTheme(themeId, mode) {
  const theme = themeById(themeId);
  const resolved = resolveMode(mode);
  const tokens = theme[resolved];
  const root = document.documentElement;
  Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
  root.style.setProperty('--hero-muted', `color-mix(in srgb, ${tokens['hero-ink']} 66%, transparent)`);
  root.style.colorScheme = resolved;
  root.dataset.theme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', tokens.bg);
}
