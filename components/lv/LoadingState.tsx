export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-10 h-10 border-3 border-[#0B5FFF] border-t-transparent rounded-full animate-spin mb-4" style={{ borderWidth: '3px' }} />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}