import { useGameStore, TALENT_TREE, calculateTalentCost } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { GitCommit, Monitor, Server, Box, X } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';

const BRANCH_ICONS: Record<string, React.ReactNode> = {
    'frontend': <Monitor size={18} />,
    'backend': <Server size={18} />,
    'devops': <Box size={18} />
};

const BRANCH_COLORS: Record<string, string> = {
    'frontend': 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5',
    'backend': 'text-green-400 border-green-400/20 bg-green-400/5',
    'devops': 'text-purple-400 border-purple-400/20 bg-purple-400/5'
};

const BRANCH_TITLES: Record<string, string> = {
    'frontend': 'CLIENT SIDE',
    'backend': 'SERVER SIDE',
    'devops': 'INFRASTRUCTURE'
};

export function TechTree({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { talents, commits, buyTalent } = useGameStore();

    // Group talents by branch
    const branches = {
        frontend: TALENT_TREE.filter(t => t.branch === 'frontend'),
        backend: TALENT_TREE.filter(t => t.branch === 'backend'),
        devops: TALENT_TREE.filter(t => t.branch === 'devops'),
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0f] border border-white/10 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
                        >
                            {/* CRT Scanline Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />

                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/40 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cta/10 text-cta rounded-lg border border-cta/20">
                                        <GitCommit size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-widest uppercase text-glow">Tech Stack Tree</h2>
                                        <p className="text-xs text-gray-400 font-mono">AVAILABLE COMMITS: <span className="text-cta font-bold text-base">{formatNumber(commits)}</span></p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                                    {(Object.keys(branches) as Array<keyof typeof branches>).map((branchKey) => (
                                        <div key={branchKey} className="flex flex-col gap-4">
                                            <div className={`p-3 rounded-lg border flex items-center justify-center gap-2 font-bold tracking-widest uppercase text-sm ${BRANCH_COLORS[branchKey]}`}>
                                                {BRANCH_ICONS[branchKey]}
                                                {BRANCH_TITLES[branchKey]}
                                            </div>

                                            <div className="flex flex-col gap-4 relative">
                                                {/* Connecting Line (Visual) */}
                                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/5 -translate-x-1/2 z-0" />

                                                {branches[branchKey].map((talent) => {
                                                    const currentLevel = talents[talent.id] || 0;
                                                    const isMaxed = currentLevel >= talent.maxLevel;
                                                    const cost = calculateTalentCost(talent.baseCost, currentLevel);
                                                    const canAfford = commits >= cost;

                                                    return (
                                                        <div key={talent.id} className="relative z-10">
                                                            <button
                                                                onClick={() => buyTalent(talent.id)}
                                                                disabled={isMaxed || !canAfford}
                                                                className={clsx(
                                                                    "w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                                                                    isMaxed
                                                                        ? "bg-white/10 border-white/20 opacity-80"
                                                                        : canAfford
                                                                            ? "bg-black/40 border-white/10 hover:border-cta/50 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                                                                            : "bg-black/20 border-white/5 opacity-40 cursor-not-allowed"
                                                                )}
                                                            >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h4 className={clsx("font-bold text-sm", isMaxed ? "text-cta" : "text-gray-200")}>
                                                                        {talent.name}
                                                                    </h4>
                                                                    <span className={clsx("text-xs font-mono px-1.5 py-0.5 rounded", isMaxed ? "bg-cta/20 text-cta" : "bg-white/5 text-gray-400")}>
                                                                        Lvl {currentLevel}/{talent.maxLevel}
                                                                    </span>
                                                                </div>

                                                                <p className="text-xs text-gray-500 mb-3 leading-relaxed min-h-[2.5em]">
                                                                    {talent.description}
                                                                </p>

                                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                                                                    <span className="text-[10px] text-cta font-medium uppercase tracking-wider">
                                                                        {talent.effectDesc(currentLevel)}
                                                                        {!isMaxed && <span className="text-gray-600"> → {talent.effectDesc(currentLevel + 1)}</span>}
                                                                    </span>

                                                                    {!isMaxed ? (
                                                                        <div className={clsx("flex items-center gap-1.5 text-xs font-bold", canAfford ? "text-white" : "text-gray-500")}>
                                                                            <GitCommit size={12} />
                                                                            {formatNumber(cost)}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-xs font-bold text-cta">MAXED</span>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
