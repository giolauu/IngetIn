export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm shadow-indigo-200',
    secondary:
      'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
    outline:
      'border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 focus:ring-indigo-400 shadow-xs',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm shadow-red-200',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-400',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm shadow-emerald-200',
    white:
      'bg-white text-indigo-900 hover:bg-indigo-50 focus:ring-white shadow-sm font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-0.5 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
