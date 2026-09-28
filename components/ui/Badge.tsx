type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-600',
  primary: 'bg-[#0B5FFF]/10 text-[#0B5FFF]',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  error: 'bg-red-50 text-red-700',
  info: 'bg-sky-50 text-sky-700',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
};

export default function Badge({ variant = 'default', size = 'sm', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full whitespace-nowrap ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
}