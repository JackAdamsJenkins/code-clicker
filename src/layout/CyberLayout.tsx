import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatNumber';
import { Activity, Radio, Lock, Server, Shield, Globe, Cpu, RefreshCw, Terminal, Skull } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

// Icon mapping for SecOps upgrades
const ICONS: Record<string, React.ReactNode> = {
    'su1': <Terminal size={20} />,
    'su2': <Lock size={20} />,
    'su3': <Globe size={20} />,
    'su4': <Skull size={20} />,
    'su5': <Activity size={20} />,
    'su6': <Shield size={20} />,
};

export default function CyberLayout() {
    const { entropy, clickSecOps, tick, secOpsUpgrades, buySecOpsUpgrade } = useGameStore();

    useEffect(() => {
        // Game loop (separate instance for now, could be unified)
        let lastTime = Date.now();
        const interval = setInterval(() => {
            const now = Date.now();
            const dt = (now - lastTime) / 1000;
            lastTime = now;
            if (dt > 0) tick(dt);
        }, 100);
        return () => clearInterval(interval);
    }, [tick]);

    // Calculate current production
    const eps = secOpsUpgrades.reduce((acc, u) => acc + (u.baseEps * u.count), 0);

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono selection:bg-green-500 selection:text-black flex flex-col md:flex-row overflow-hidden relative">

            {/* Matrix Rain / Grid Background */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50 contrast-200"></div>
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(18,18,18,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

            {/* Left Panel: Terminal & Interaction */}
            <section className="w-full md:w-5/12 lg:w-4/12 border-b md:border-b-0 md:border-r border-green-900/50 p-8 flex flex-col relative z-10 bg-black/80">

                {/* Header Info */}
                <div className="flex items-center justify-between mb-12 border-b border-green-900/50 pb-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-green-700">
                        <Server size={14} />
                        <span>Connected to: MAIN_FRAME_ZERO</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-green-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Secure</span>
                    </div>
                </div>

                {/* Main Stats Display */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                    <div className="text-center space-y-2">
                        <h3 className="text-green-700 text-sm uppercase tracking-[0.2em] mb-2">Entropy Pool</h3>
                        <div className="text-6xl md:text-7xl font-bold tracking-tighter text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                            {formatNumber(Math.floor(entropy))}
                        </div>
                        <div className="text-green-600 font-bold flex items-center justify-center gap-2">
                            <Activity size={16} className="animate-pulse" />
                            <span>{formatNumber(eps)} / SEC</span>
                        </div>
                    </div>

                    {/* The Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clickSecOps}
                        className="group relative w-64 h-64 rounded-full bg-green-900/10 border-2 border-green-500/30 flex items-center justify-center cursor-pointer overflow-hidden backdrop-blur-sm transition-all hover:border-green-400/60 hover:shadow-[0_0_50px_rgba(34,197,94,0.2)]"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.green.500/0.1),transparent_70%)] group-hover:opacity-100 opacity-50 transition-opacity" />

                        <div className="relative z-10 flex flex-col items-center gap-2 text-green-400">
                            <Radio size={48} className="mb-2 group-hover:animate-ping" />
                            <span className="text-xl font-bold tracking-widest uppercase group-hover:text-green-300">Intrude</span>
                            <span className="text-[10px] text-green-600 uppercase tracking-widest group-hover:text-green-500">Click to Hack</span>
                        </div>
                    </motion.button>
                </div>

                {/* Terminal Footer */}
                <div className="mt-8 p-4 bg-black border border-green-900/50 rounded text-xs font-mono text-green-600/80 h-32 overflow-hidden relative">
                    <div className="absolute top-2 right-2 opacity-50"><Cpu size={12} /></div>
                    <div className="flex flex-col gap-1">
                        <p>&gt; System initialized...</p>
                        <p>&gt; Handshake established.</p>
                        <p>&gt; Uplink secure. Latency: 12ms</p>
                        <p className="animate-pulse">&gt; Awaiting command input_</p>
                    </div>
                </div>
            </section>

            {/* Right Panel: Shop */}
            <section className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black z-10">
                <header className="mb-8 flex items-baseline justify-between border-b border-green-900/30 pb-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-green-500 flex items-center gap-3">
                        <Terminal size={24} />
                        Cyber Arsenal
                    </h2>
                    <span className="text-xs text-green-800 uppercase tracking-[0.2em] font-bold">V.2.0.4.Beta</span>
                </header>

                <div className="grid grid-cols-1 gap-3">
                    {secOpsUpgrades.map((u) => {
                        const cost = Math.floor(u.baseCost * Math.pow(1.15, u.count));
                        const canAfford = entropy >= cost;

                        return (
                            <button
                                key={u.id}
                                onClick={() => buySecOpsUpgrade(u.id)}
                                disabled={!canAfford}
                                className={clsx(
                                    "relative group flex items-center justify-between p-4 border rounded transition-all duration-200 text-left overflow-hidden",
                                    canAfford
                                        ? "bg-green-900/10 border-green-500/30 hover:bg-green-900/20 hover:border-green-400/50 cursor-pointer"
                                        : "opacity-40 border-green-900/10 cursor-not-allowed hidden" // Hidden if can't verify? No, keep visible disabled
                                )}
                            >
                                {/* Scanline effect */}
                                {canAfford && <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(34,197,94,0.05)_50%,transparent_100%)] translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none" />}

                                <div className="flex items-center gap-4 z-10">
                                    <div className={clsx("p-3 rounded border", canAfford ? "bg-black border-green-500/30 text-green-400" : "bg-black border-green-900/20 text-green-900")}>
                                        {ICONS[u.id] || <CircleDashed size={20} />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-green-400 group-hover:text-green-300 transition-colors uppercase tracking-wider text-sm">
                                            {u.name}
                                        </div>
                                        <div className="text-[10px] text-green-700 uppercase tracking-widest mt-0.5">
                                            {u.description}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right z-10">
                                    <div className="font-bold text-green-400 text-lg tracking-tighter">
                                        {formatNumber(cost)}
                                    </div>
                                    <div className="text-[10px] text-green-600 uppercase font-bold flex items-center justify-end gap-1">
                                        <span>+ {formatNumber(u.baseEps)} EPS</span>
                                        <span className="bg-green-900/30 px-1 rounded text-green-500">Lv. {u.count}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

function CircleDashed({ size }: { size: number }) {
    return <RefreshCw size={size} />;
}
