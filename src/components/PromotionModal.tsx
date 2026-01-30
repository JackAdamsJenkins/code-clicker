import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ShieldCheck, Ban, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PromotionModal() {
    const { commits, gameMode, promoteToSecOps } = useGameStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (commits >= 100 && gameMode === 'dev') {
            setIsOpen(true);
        }
    }, [commits, gameMode]);

    const handleAccept = () => {
        setIsOpen(false);
        promoteToSecOps();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-zinc-900 border border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.2)] rounded-lg overflow-hidden font-mono"
                    >
                        {/* Header */}
                        <div className="bg-green-500/10 border-b border-green-500/30 p-6 flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-full text-green-400 animate-pulse">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-green-400 tracking-wider uppercase">Career Promotion</h2>
                                <p className="text-green-500/60 text-sm">Clearance Level: TOP SECRET</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4 text-green-100/80">
                            <p>
                                You have reached the pinnacle of software engineering. Your ability to generate commits has drawn the attention of <span className="text-green-400 font-bold">SecOps Command</span>.
                            </p>
                            <p>
                                We are offering you a position in Cybersecurity. This involves a complete paradigm shift.
                            </p>

                            <ul className="space-y-2 py-4 text-sm bg-black/30 p-4 rounded border border-green-900/50">
                                <li className="flex items-center gap-2">
                                    <Terminal size={14} className="text-green-500" />
                                    <span>New Objective: Generate <span className="text-green-400">Entropy</span></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Terminal size={14} className="text-green-500" />
                                    <span>New Tools: Exploits, Botnets, AI Sentinels</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Terminal size={14} className="text-green-500" />
                                    <span>Warning: Previous Dev environment will be archived.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="p-6 pt-0 flex gap-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-3 px-4 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 group"
                            >
                                <Ban size={18} className="group-hover:scale-110 transition-transform" />
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 py-3 px-4 rounded bg-green-600 hover:bg-green-500 text-black font-bold transition-all shadow-lg shadow-green-900/50 flex items-center justify-center gap-2 group"
                            >
                                <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform" />
                                Accept Promotion
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
