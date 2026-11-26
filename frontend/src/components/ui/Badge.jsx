export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  icon: Icon,
}) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border';

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-sm px-3 py-1 gap-1.5',
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    // Status badges
    terlambat: 'bg-red-50 text-red-700 border-red-200',
    'minggu-ini': 'bg-amber-50 text-amber-700 border-amber-200',
    'akan-datang': 'bg-blue-50 text-blue-700 border-blue-200',
    selesai: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    // Type badges
    bulanan: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    sekali: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const resolvedClass = variantClasses[variant] || variantClasses.default;

  return (
    <span className={`${baseClasses} ${sizeClasses[size] || sizeClasses.sm} ${resolvedClass} ${className}`}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}
