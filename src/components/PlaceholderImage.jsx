/**
 * Stand-in for real product/lifestyle photography (none was supplied in the
 * design handoff — only the logo and background texture are real assets).
 * Swap the parent's onImageReady/src wiring for actual <img> tags once photos
 * are available; this keeps layout and spacing identical to the prototype's
 * "image-slot" placeholders.
 */
export default function PlaceholderImage({ label, className = '', rounded = false }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-cp-surface to-cp-bg border border-cp-border text-center px-3 ${
        rounded ? 'rounded' : ''
      } ${className}`}
    >
      <span className="font-garamond italic text-xs text-cp-muted-3 leading-snug">
        {label}
      </span>
    </div>
  )
}
