import { useGameStore, SKILLS } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Coffee, Zap, Bug } from 'lucide-react';
import { clsx } from 'clsx';

const ICONS: Record<string, React.ReactNode> = {
    's1': <Coffee size={20} />,
    's2': <Zap size={20} />,
    's3': <Bug size={20} />,
};

export default function SkillPanel() {
    const { skills, activateSkill } = useGameStore();

    return (
        <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                <Zap size={16} /> Active Protocols
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SKILLS.map((skill) => {
                    const state = skills[skill.id] || { activeTimeRemaining: 0, cooldownRemaining: 0 };
                    const isActive = state.activeTimeRemaining > 0;
                    const onCooldown = state.cooldownRemaining > 0;

                    // Inverting progress for the visual fill effect logic
                    // If progress is 100%, it's fully cooled down? No. 
                    // Let's visualize cooldown as a gray overlay that shrinks.
                    const cooldownPercent = onCooldown
                        ? (state.cooldownRemaining / skill.cooldown) * 100
                        : 0;

                    return (
                        <motion.button
                            key={skill.id}
                            onClick={() => activateSkill(skill.id)}
                            disabled={onCooldown || isActive}
                            whileTap={(!onCooldown && !isActive) ? { scale: 0.95 } : {}}
                            animate={isActive ? {
                                boxShadow: ["0 0 0px rgba(244,63,94,0)", "0 0 20px rgba(244,63,94,0.5)", "0 0 0px rgba(244,63,94,0)"],
                                transition: { duration: 2, repeat: Infinity }
                            } : {}}
                            className={clsx(
                                "relative overflow-hidden rounded-xl border p-3 min-h-[100px] flex flex-col justify-between transition-all outline-none",
                                isActive
                                    ? "bg-cta/10 border-cta"
                                    : onCooldown
                                        ? "bg-background/20 border-white/5 opacity-70 cursor-not-allowed"
                                        : "bg-background/40 border-primary/20 hover:border-cta hover:bg-background/60 cursor-pointer shadow-sm"
                            )}
                        >
                            {/* Cooldown Overlay (Vertical Fill) */}
                            {onCooldown && (
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-black/40 z-0 pointer-events-none"
                                    style={{ height: `${cooldownPercent}%`, transition: 'height 0.1s linear' }}
                                />
                            )}

                            {/* Active Progress Bar (Horizontal) */}
                            {isActive && (
                                <div
                                    className="absolute bottom-0 left-0 h-1 bg-cta z-20"
                                    style={{
                                        width: `${(state.activeTimeRemaining / (skill.duration || 1)) * 100}%`,
                                        transition: 'width 0.1s linear'
                                    }}
                                />
                            )}

                            <div className="relative z-10 flex w-full justify-between items-start">
                                <div className={clsx(
                                    "p-1.5 rounded-md",
                                    isActive ? "text-cta" : "text-primary"
                                )}>
                                    {ICONS[skill.id]}
                                </div>

                                <div className="text-right">
                                    {isActive && (
                                        <span className="text-[10px] font-bold text-cta block animate-pulse">
                                            ACTIVE
                                        </span>
                                    )}
                                    {onCooldown && !isActive && (
                                        <span className="text-[10px] font-mono text-gray-400 block">
                                            {Math.ceil(state.cooldownRemaining)}s
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="relative z-10 text-left mt-2 pl-1">
                                <div className={clsx("font-bold text-sm leading-none mb-1", isActive ? "text-white" : "text-gray-200")}>
                                    {skill.name}
                                </div>
                                <div className="text-[10px] text-gray-500 leading-tight">
                                    {skill.description}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
