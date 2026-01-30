import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { GitCommit, GitBranch } from 'lucide-react';
import clsx from 'clsx';
import { formatNumber } from '../utils/formatNumber';

export default function PrestigeModal() {
    const { commits, getPrestigeGain, prestige, getNextCommitCost } = useGameStore();
    const gain = getPrestigeGain();
    const nextCost = getNextCommitCost();
    const canPrestige = gain > 0;

    // Simple state to toggle logic, but usually this is controlled by parent.
    // However, we want it to be always available as a "Git Status" button that opens a modal.
    // Let's implement the localized open state for now.

    // Actually, "Git Push" is an action.
    // We can show a button that is disabled if gain is 0?
    // Or we show a status panel.

    // Let's create a "Git Status" button that expands.
    return (
        <div className="fixed bottom-6 left-6 z-50">
            <GitControls
                gain={gain}
                commits={commits}
                canPrestige={canPrestige}
                onPrestige={prestige}
                nextCost={nextCost}
            />
        </div>
    );
}

function GitControls({ gain, commits, canPrestige, onPrestige, nextCost }: {
    gain: number,
    commits: number,
    canPrestige: boolean,
    onPrestige: () => void,
    nextCost: number
}) {
    const [isOpen, setIsOpen] = useState(false);

    const handlePrestige = () => {
        if (confirm("Are you sure you want to Push Commits? This will reset your current code stats!")) {
            onPrestige();
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-16 left-0 w-72 bg-gray-900 border border-secondary rounded-lg shadow-2xl p-4 text-white overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center space-x-2 mb-4 border-b border-gray-700 pb-2">
                            <GitBranch className="text-secondary" />
                            <h3 className="font-bold text-lg">Git Status</h3>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Current Branch:</span>
                                <span className="font-mono text-cta">main</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Total Commits:</span>
                                <span className="font-mono text-white">{formatNumber(commits)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Multiplier:</span>
                                <span className="font-mono text-green-400">x{formatNumber(1 + commits * 0.1)}</span>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="bg-black/40 p-3 rounded border border-gray-800 mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500">Unstaged Changes (LoC):</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-yellow-400 font-bold">+{formatNumber(gain)} Commits</span>
                                {gain > 0 && <span className="text-xs text-green-500 animate-pulse">Ready to Push</span>}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">
                                Next commit requires {formatNumber(nextCost)} LoC (Cost scales +15%).
                            </p>
                        </div>

                        <button
                            onClick={handlePrestige}
                            disabled={!canPrestige}
                            className={clsx(
                                "w-full py-2 rounded font-bold flex items-center justify-center space-x-2 transition-all",
                                canPrestige
                                    ? "bg-cta hover:bg-cta/80 text-white shadow-lg shadow-cta/20"
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            <GitCommit size={16} />
                            <span>GIT PUSH --FORCE</span>
                        </button>

                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-900 border border-secondary text-secondary hover:text-white hover:border-cta hover:bg-gray-800 p-3 rounded-full shadow-lg transition-all active:scale-95 group"
            >
                <GitBranch size={24} className={clsx("transition-transform duration-500", isOpen ? "rotate-90" : "group-hover:rotate-12")} />
                {gain > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cta opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-cta items-center justify-center text-[8px] text-white font-bold">{gain > 9 ? '!' : formatNumber(gain)}</span>
                    </span>
                )}
            </button>
        </div>
    );
}


