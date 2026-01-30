import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import ClickArea from '../components/ClickArea';
import UpgradePanel from '../components/UpgradePanel';
import ThemeToggle from '../components/ThemeToggle';
import ActiveBugs from '../components/ActiveBugs';

export default function GameLayout() {
    const tick = useGameStore((state) => state.tick);
    const spawnBug = useGameStore((state) => state.spawnBug);

    useEffect(() => {
        // Game loop - tick every 100ms
        const interval = setInterval(() => {
            tick(0.1);

            // Random bug spawn (approx every 10-20 seconds)
            // 1% chance per tick (10 ticks/sec = 10% chance per second) -> too high?
            // Let's settle on 0.5% chance per 100ms tick = ~5% chance per second.
            if (Math.random() < 0.005) {
                spawnBug();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [tick, spawnBug]);

    return (
        <div className="min-h-screen bg-background text-text font-sans selection:bg-cta selection:text-white flex flex-col md:flex-row overflow-hidden relative">

            {/* Background Effects (Cyberpunk Grid/Glow) */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cta/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            <ActiveBugs />

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

                <div className="w-full max-w-6xl mx-auto">
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
