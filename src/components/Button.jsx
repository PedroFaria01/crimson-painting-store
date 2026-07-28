const BASE =
  'font-cinzel text-[13px] tracking-[1.5px] uppercase font-semibold rounded cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

const VARIANTS = {
  solid:
    'bg-cp-crimson text-cp-cream-bright border border-cp-crimson-bright hover:bg-cp-crimson-bright',
  outline:
    'bg-transparent text-cp-gold-dim border border-cp-gold-dim hover:text-cp-gold hover:border-cp-gold',
}

export default function Button({
  as: As = 'button',
  variant = 'solid',
  className = '',
  children,
  ...props
}) {
  return (
    <As className={`${BASE} ${VARIANTS[variant]} px-8 py-4 ${className}`} {...props}>
      {children}
    </As>
  )
}
