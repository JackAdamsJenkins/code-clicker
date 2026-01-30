import { useState, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code, Cpu } from 'lucide-react';
import { clsx } from 'clsx';

const SNIPPETS = [
    'const', 'let', 'var', 'await', 'async', 'return', 'import', 'export',
    '<div>', 'span', 'npm', 'yarn', 'git', 'push', 'merge', 'fix'
];

interface Particle {
    id: number;
    x: number;
    y: number;
    text: string;
}

export default function ClickArea() {
    const { linesOfCode, cps, click, clickPower } = useGameStore();
    const [particles, setParticles] = useState<Particle[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent default to avoid double fire
        // e.preventDefault(); 

        click();

        // Create particle
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        // Random snippet
        const text = Math.random() > 0.7 ? SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)] : `+${clickPower}`;

        const newParticle = {
            id: Date.now() + Math.random(),
            x: clientX,
            y: clientY,
            text
        };

        setParticles(prev => [...prev.slice(-20), newParticle]); // Limit particles
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-12 select-none relative z-20">

            {/* Stats Display */}
            <div className="text-center space-y-4 z-20">
                <div className="flex items-center justify-center space-x-3 mb-6">
                    <div className="p-4 bg-primary/20 rounded-xl border border-primary shadow-[0_0_15px_rgba(124,58,237,0.5)] backdrop-blur-md">
                        <Terminal className="w-8 h-8 text-primary drop-shadow-[0_0_5px_rgba(124,58,237,1)]" />
                    </div>
                </div>

                <div className="relative">
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-white leading-tight text-glow filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {Math.floor(linesOfCode).toLocaleString()}
                    </h1>
                    <div className="absolute -inset-1 bg-primary/20 blur-xl -z-10 rounded-full opacity-50"></div>
                </div>

                <p className="text-sm font-medium tracking-[0.2em] uppercase text-secondary">Lines of Code</p>

                <div className="inline-flex items-center space-x-2 px-6 py-2 mt-4 bg-background/50 border border-primary/30 rounded-full text-xs font-mono font-bold text-cta shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                    <Cpu size={14} className="animate-pulse" />
                    <span>{cps.toFixed(1)} LOC/s</span>
                </div>
            </div>

            {/* Interactive Terminal/Button */}
            <motion.button
                ref={buttonRef}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInteraction}
                className={clsx(
                    "relative group w-64 h-64 md:w-80 md:h-80 rounded-full",
                    "bg-black/40 border-4 border-primary/50 shadow-[0_0_30px_rgba(124,58,237,0.3)]",
                    "flex items-center justify-center overflow-hidden cursor-pointer",
                    "transition-all duration-300 hover:border-cta hover:shadow-[0_0_50px_rgba(244,63,94,0.5)]",
                    "active:ring-4 active:ring-cta/30 backdrop-blur-xl"
                )}
            >
                {/* Inner Glow Pulse */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 group-hover:opacity-100" />

                <Code className="w-32 h-32 text-white/80 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" strokeWidth={1} />

                <span className="absolute bottom-16 text-xs text-cta/80 font-mono tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                    INITIALIZE_SEQ
                </span>
            </motion.button>

            {/* Floating Particles Overlay */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
                <AnimatePresence>
                    {particles.map(p => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 1, y: p.y - 20, x: p.x, scale: 0.5 }}
                            animate={{ opacity: 0, y: p.y - 200, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={clsx(
                                "absolute font-mono font-bold text-xl drop-shadow-[0_0_5px_rgba(0,0,0,1)]",
                                p.text.startsWith('+') ? "text-cta text-glow" : "text-primary text-sm opacity-80"
                            )}
                            onAnimationComplete={() => setParticles(prev => prev.filter(item => item.id !== p.id))}
                        >
                            {p.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

        </div>
    );
}
