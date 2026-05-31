import React from 'react'

/**
 * ToolbarButton: Senior-level UX
 * - Icon desteği (icon prop)
 * - Tooltip (görsel, gecikmeli, üstte)
 * - Hover ve active state (gelişmiş Tailwind)
 * - Accessible
 */
function ToolbarButton({
  onClick,
  disabled = false,
  className = '',
  title = '',
  icon: Icon,
  children,
  as = 'button',
  ...rest
}) {
  const [showTooltip, setShowTooltip] = React.useState(false)
  const tooltipTimeout = React.useRef()
  const Component = as
  // Gelişmiş stiller
  const defaultClass = [
    'relative',
    'rounded-xl',
    'transition-all',
    'active:scale-95',
    'duration-100',
    'cursor-pointer',
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-indigo-400',
    'hover:bg-zinc-700',
    'active:bg-zinc-800',
    'disabled:opacity-40',
    'group',
  ].join(' ')

  // Tooltip gösterimi (hover ve focus ile)
  const handleMouseEnter = () => {
    if (title) {
      tooltipTimeout.current = setTimeout(() => setShowTooltip(true), 400)
    }
  }
  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeout.current)
    setShowTooltip(false)
  }
  const handleFocus = () => {
    if (title) setShowTooltip(true)
  }
  const handleBlur = () => setShowTooltip(false)

  return (
    <Component
      onClick={onClick}
      disabled={as === 'button' ? disabled : undefined}
      className={`${defaultClass} ${className}`.trim()}
      aria-label={title}
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    >
      {/* Icon desteği */}
      {Icon && <Icon className="w-5 h-5 mx-auto" />}
      {/* Çocuklar (yazı veya ekstra içerik) */}
      {children}
      {/* Tooltip */}
      {title && showTooltip && (
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-2 z-50 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs text-zinc-100 shadow-lg border border-zinc-800 opacity-90 animate-fade-in">
          {title}
        </span>
      )}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(0.5rem); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.18s cubic-bezier(.16,1,.3,1) forwards; }
      `}</style>
    </Component>
  )
}

export default ToolbarButton
