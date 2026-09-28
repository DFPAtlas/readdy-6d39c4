interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  centered?: boolean;
}

export default function SectionHeader({ title, description, action, centered = false }: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between mb-8 ${centered ? 'text-center flex-col' : ''}`}>
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900">{title}</h2>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {action && (
        <a
          href={action.href}
          className="text-sm font-medium text-[#0B5FFF] hover:text-blue-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {action.label} &rarr;
        </a>
      )}
    </div>
  );
}