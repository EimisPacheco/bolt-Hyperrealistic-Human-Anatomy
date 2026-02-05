import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 border border-rose-500/20 flex items-center justify-center backdrop-blur-sm">
          <Activity className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white/90 tracking-tight leading-none">
            Human Anatomy
          </h1>
          <p className="text-xs text-white/40 mt-0.5">Interactive 3D Atlas</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-white/50">3D Rendering Active</span>
        </div>
      </div>
    </header>
  );
}
