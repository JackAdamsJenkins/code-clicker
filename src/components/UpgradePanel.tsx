import { useGameStore, type Upgrade } from '../store/gameStore';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Keyboard, FileCode, Copy, Monitor, Users, Bot, CircleDashed } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';

const ICONS: Record<string, React.ReactNode> = {
    'u1': <Keyboard size={24} />,
    'u2': <Copy size={24} />,
    'u3': <FileCode size={24} />,
    'u4': <Monitor size={24} />,
    'u5': <Users size={24} />,
    'u6': <Bot size={24} />,
};

export default function UpgradePanel() {
    const { upgrades, linesOfCode, buyUpgrade, commits, talents, skills, bugs } = useGameStore();

    const getCost = (u: Upgrade) => Math.floor(u.baseCost * Math.pow(1.15, u.count));

    // Calculate Global Multiplier (Replicating store logic for display)
    const commitMultiplier = 1 + (commits * 0.1);
    const bugPenalty = bugs.length > 0 ? (1 - (0.2 * bugs.length)) : 1;
    const effectiveBugPenalty = Math.max(0, bugPenalty);

    let skillCpsMultiplier = 1;
    if (skills['s1']?.activeTimeRemaining > 0) {
        skillCpsMultiplier = 2;
    }

    const b1Level = talents['t_b1'] || 0;
    const talentMultiplier = 1 + (b1Level * 0.25);

    const totalMultiplier = commitMultiplier * skillCpsMultiplier * effectiveBugPenalty * talentMultiplier;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-20">
            {upgrades.map((u) => {
                const cost = getCost(u);
                const canAfford = linesOfCode >= cost;
                const effectiveCps = u.baseCps * totalMultiplier;

                return (
                    <motion.button
                        key={u.id}
                        layout
                        onClick={() => buyUpgrade(u.id)}
                        disabled={!canAfford}
                        whileTap={canAfford ? { scale: 0.98 } : {}}
                        whileHover={canAfford ? { scale: 1.01 } : {}}
                        className={clsx(
                            "group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left w-full outline-none backdrop-blur-md overflow-hidden",
                            canAfford
                                ? "bg-background/40 border-primary/30 hover:border-cta hover:bg-background/60 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(244,63,94,0.2)] cursor-pointer"
                                : "bg-background/20 border-white/5 opacity-50 cursor-not-allowed grayscale-[0.5]"
                        )}
                    >
                        {/* Hover Effect Gradient */}
                        <div className={clsx(
                            "absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12 translate-x-[-150%] transition-transform duration-700",
                            canAfford && "group-hover:translate-x-[150%]"
                        )} />

                        <div className="flex items-center gap-4 relative z-10 flex-1 min-w-0">
                            <div className={clsx(
                                "p-3 rounded-lg transition-all duration-300 border py-3 shrink-0",
                                canAfford
                                    ? "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                                    : "bg-white/5 text-white/20 border-transparent"
                            )}>
                                {ICONS[u.id] || <CircleDashed size={20} />}
                            </div>

                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                <span className={clsx(
                                    "font-bold text-base transition-colors truncate",
                                    canAfford ? "text-white group-hover:text-cta group-hover:text-glow" : "text-gray-500"
                                )}>
                                    {u.name}
                                </span>
                                <span className="text-[10px] text-text/60 font-medium leading-tight line-clamp-1">
                                    {u.description}
                                </span>
                                <span className="text-[9px] uppercase tracking-widest text-secondary mt-0.5 font-bold">
                                    +{formatNumber(effectiveCps)} LOC/s
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 relative z-10 ml-2 shrink-0">
                            <span className={clsx(
                                "font-mono text-lg font-bold tracking-tight",
                                canAfford ? "text-white text-glow" : "text-gray-500"
                            )}>
                                {formatNumber(cost)}
                            </span>
                            <div className={clsx(
                                "flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                                canAfford ? "text-secondary border-secondary/20 bg-secondary/5" : "text-gray-600 border-white/5 bg-white/5"
                            )}>
                                Lv. {u.count}
                            </div>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
