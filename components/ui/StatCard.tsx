interface StatCardProps {
  value: string;
  label: string;
  icon?: string;
}

export default function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="text-center">
      {icon && (
        <div className="w-12 h-12 bg-[#0B5FFF]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
          <i className={`${icon} text-[#0B5FFF] text-xl`} />
        </div>
      )}
      <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}