interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Input({
  label,
  error,
  hint,
  icon,
  size = 'md',
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-5 py-4 text-lg',
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <i className={`${icon} absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm`} />
        )}
        <input
          id={inputId}
          className={`w-full rounded-lg border focus:outline-none transition-colors ${sizeClasses[size]} ${icon ? 'pl-9' : ''} ${error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-[#0B5FFF]'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}