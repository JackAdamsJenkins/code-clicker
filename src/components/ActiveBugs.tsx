import { motion, AnimatePresence } from 'framer-motion';
import { Bug as BugIcon } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export default function ActiveBugs() {
    const bugs = useGameStore((state) => state.bugs);
    const catchBug = useGameStore((state) => state.catchBug);

    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {bugs.map((bug) => (
                    <motion.button
                        key={bug.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, rotate: [0, -10, 10, 0] }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            duration: 0.5,
                            rotate: { repeat: Infinity, duration: 2 }
                        }}
                        className="absolute pointer-events-auto p-4 group cursor-pointer"
                        style={{ top: `${bug.y}%`, left: `${bug.x}%` }}
                        onClick={() => catchBug(bug.id)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <div className="relative">
                            <BugIcon
                                size={48}
                                className="text-red-500 drop-shadow-lg filter"
                            />
                            {/* Glitch effect overlay */}
                            <div className="absolute inset-0 bg-red-500 mix-blend-overlay opacity-0 group-hover:opacity-50 animate-pulse rounded-full" />

                            {/* "FIX ME" label on hover */}
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                whileHover={{ opacity: 1, y: -0 }}
                                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap"
                            >
                                HOTFIX!
                            </motion.span>
                        </div>
                    </motion.button>
                ))}
            </AnimatePresence>
        </div>
    );
}
