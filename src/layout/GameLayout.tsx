import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import ClickArea from '../components/ClickArea';
import UpgradePanel from '../components/UpgradePanel';
import ThemeToggle from '../components/ThemeToggle';
import ActiveBugs from '../components/ActiveBugs';
import PrestigeModal from '../components/PrestigeModal';
import SkillPanel from '../components/SkillPanel';

export default function GameLayout() {
    const tick = useGameStore((state) => state.tick);
    const spawnBug = useGameStore((state) => state.spawnBug);

    useEffect(() => {
        // Game loop - using delta time to handle background throttling
        let lastTime = Date.now();

        const interval = setInterval(() => {
            const now = Date.now();
            const dt = (now - lastTime) / 1000;
            lastTime = now;

            // Update game state based on actual time elapsed
            if (dt > 0) {
                tick(dt);
            }

            // Random bug spawn logic
            // We scale the probability based on time passed to keep spawn rate consistent
            // Base chance: 0.5% per 100ms -> approx 5% per second
            // Probability of *at least one* spawn in time dt: P = 1 - (1 - p)^n where n = dt / 0.1
            // Approximation for small p*n: P ~= p * n = 0.005 * (dt / 0.1) = 0.05 * dt
            if (Math.random() < 0.05 * dt) {
                spawnBug();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [tick, spawnBug]);

    // Dynamic Title Updater
    useEffect(() => {
        const unsubscribe = useGameStore.subscribe((state) => {
            document.title = `${Math.floor(state.linesOfCode).toLocaleString()} LoC - Code Clicker`;
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-background text-text font-sans selection:bg-cta selection:text-white flex flex-col md:flex-row overflow-hidden relative">

            {/* Background Effects (Cyberpunk Grid/Glow) */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cta/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            <ActiveBugs />
            <PrestigeModal />

            {/* Left Panel: Click Area & Stats */}
            <section className="w-full md:w-5/12 lg:w-4/12 border-b md:border-b-0 md:border-r border-primary/30 p-8 flex flex-col items-center justify-center relative z-10 backdrop-blur-md bg-background/60">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>
                <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 md:hidden"></div>

                <ClickArea />
            </section>

            {/* Right Panel: Upgrades & Shop */}
            <section className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-primary scrollbar-track-background/50 z-10 relative">
                <div className="absolute top-6 right-6 z-50">
                    <ThemeToggle />
                </div>

                <div className="w-full max-w-6xl mx-auto pb-20">
                    <SkillPanel />
                    <header className="mb-6 border-l-4 border-cta pl-6 py-2 bg-gradient-to-r from-cta/10 to-transparent rounded-r-lg backdrop-blur-sm">
                        <div className="flex items-baseline gap-4">
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-white text-glow">System Upgrades</h2>
                            <p className="text-secondary font-medium tracking-wide font-mono text-xs hidden sm:block">&lt;Optimize codebase generation /&gt;</p>
                        </div>
                    </header>
                    <UpgradePanel />
                </div>
            </section>

        </div>
    );
}
