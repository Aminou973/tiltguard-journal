// The brand mark: a level line, and a price path that comes down to it, touches once and turns up.
// Line and path keep their brand colours; the touch point follows the theme (currentColor).
export const BRAND = "TiltGuard Journal";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="8 12 48 36" role="img" className={className}>
      <title>TiltGuard Journal</title>
      <rect x="10" y="39.75" width="44" height="4" rx="2" fill="#34c48b" />
      <path
        d="M13 16 C 21 16 24.5 37.5 32 38 C 39.5 37.5 43 16 51 16"
        fill="none"
        stroke="#b49cff"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="38" r="3.8" fill="currentColor" />
    </svg>
  );
}
