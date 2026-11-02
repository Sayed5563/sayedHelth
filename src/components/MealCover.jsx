import Icon from './Icon.jsx';

// Optional food photos: drop an image named after the meal id into src/photos/
// (breakfast.jpg, snack-am.jpg, lunch.jpg, snack-pm.jpg, dinner.jpg) and it is used automatically.
const photoModules = import.meta.glob('../photos/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });
const photos = Object.fromEntries(
  Object.entries(photoModules).map(([path, url]) => [path.split('/').pop().replace(/\.\w+$/, ''), url]),
);

// Each meal gets its own small still-life of soft shapes, coloured from the theme tokens.
const scenes = {
  breakfast: (
    <>
      <circle cx="78" cy="70" r="30" fill="var(--gold-soft)" />
      <path d="M20 96h120" stroke="var(--line-strong)" strokeWidth="1.5" />
      <ellipse cx="62" cy="88" rx="22" ry="9" fill="var(--paper)" />
      <circle cx="62" cy="84" r="7" fill="var(--gold)" />
    </>
  ),
  'snack-am': (
    <>
      <circle cx="64" cy="66" r="24" fill="var(--sage-soft)" />
      <circle cx="98" cy="76" r="15" fill="var(--gold-soft)" />
      <path d="M64 42c2-8 8-12 14-12" stroke="var(--forest)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M20 96h120" stroke="var(--line-strong)" strokeWidth="1.5" />
    </>
  ),
  lunch: (
    <>
      <circle cx="80" cy="64" r="34" fill="var(--paper)" />
      <path d="M80 30a34 34 0 0 1 0 68Z" fill="var(--sage-soft)" />
      <path d="M80 64H46a34 34 0 0 1 34-34Z" fill="var(--gold-soft)" />
      <circle cx="80" cy="64" r="34" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
    </>
  ),
  'snack-pm': (
    <>
      <path d="M58 46h40l-4 40a6 6 0 0 1-6 5H68a6 6 0 0 1-6-5Z" fill="var(--paper)" />
      <path d="M60 60h36" stroke="var(--line-strong)" strokeWidth="1.5" />
      <circle cx="112" cy="80" r="12" fill="var(--gold-soft)" />
      <path d="M20 96h120" stroke="var(--line-strong)" strokeWidth="1.5" />
    </>
  ),
  dinner: (
    <>
      <circle cx="104" cy="40" r="14" fill="var(--gold-soft)" />
      <circle cx="110" cy="35" r="12" fill="var(--cover-bg)" />
      <ellipse cx="72" cy="80" rx="36" ry="12" fill="var(--paper)" />
      <path d="M44 74c6-14 50-14 56 0" fill="var(--sage-soft)" />
      <path d="M20 96h120" stroke="var(--line-strong)" strokeWidth="1.5" />
    </>
  ),
};

export default function MealCover({ meal, size = 'md' }) {
  const photo = photos[meal.id];
  return (
    <div className={`cover cover-${size}`} aria-hidden="true">
      {photo ? (
        <img src={photo} alt="" loading="lazy" />
      ) : (
        <svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice">
          <rect width="160" height="110" fill="var(--cover-bg)" />
          {scenes[meal.id]}
        </svg>
      )}
      <span className="cover-badge"><Icon name={meal.icon} size={size === 'sm' ? 18 : 20} /></span>
    </div>
  );
}
