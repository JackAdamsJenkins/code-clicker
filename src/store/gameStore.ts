import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Upgrade {
    id: string;
    name: string;
    baseCost: number;
    baseCps: number; // Code per second
    baseClick: number; // Click multiplier/adder
    count: number;
    description: string;
}

interface Bug {
    id: string;
    x: number;
    y: number;
    createdAt: number;
}

interface GameState {
    linesOfCode: number;
    cps: number;
    clickPower: number;
    upgrades: Upgrade[];
    bugs: Bug[];

    // Actions
    click: () => void;
    tick: (seconds: number) => void;
    buyUpgrade: (id: string) => void;
    spawnBug: () => void;
    catchBug: (id: string) => void;
    cleanupBugs: () => void;
    reset: () => void;

    // Prestige
    commits: number;
    lifetimeLines: number;
    getPrestigeGain: () => number;
    prestige: () => void;
}

const INITIAL_UPGRADES: Upgrade[] = [
    { id: 'u1', name: 'Fix Typos', baseCost: 15, baseCps: 0.1, baseClick: 0, count: 0, description: 'Correct simple mistakes.' },
    { id: 'u2', name: 'Snippets', baseCost: 100, baseCps: 1, baseClick: 0, count: 0, description: 'Copy-paste efficiency.' },
    { id: 'u3', name: 'Linter', baseCost: 1100, baseCps: 8, baseClick: 0, count: 0, description: 'Auto-fix formatting.' },
    { id: 'u4', name: 'Mechanical Keyboard', baseCost: 12000, baseCps: 47, baseClick: 0, count: 0, description: 'Clickity clack!' },
    { id: 'u5', name: 'Pair Programmer', baseCost: 130000, baseCps: 260, baseClick: 0, count: 0, description: 'Two heads are better.' },
    { id: 'u6', name: 'AI Assistant', baseCost: 1400000, baseCps: 1400, baseClick: 0, count: 0, description: 'Code generates itself.' },
];

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            linesOfCode: 0,
            cps: 0,
            clickPower: 1,
            upgrades: INITIAL_UPGRADES,
            commits: 0,
            lifetimeLines: 0,

            click: () => {
                set((state) => {
                    const multiplier = 1 + (state.commits * 0.1); // +10% per commit
                    return {
                        linesOfCode: state.linesOfCode + (state.clickPower * multiplier),
                        lifetimeLines: state.lifetimeLines + (state.clickPower * multiplier) // Track lifetime
                    };
                });
            },

            tick: (seconds) => {
                const { cps, cleanupBugs, commits } = get();
                const multiplier = 1 + (commits * 0.1);

                if (cps > 0) {
                    set((state) => ({
                        linesOfCode: state.linesOfCode + (cps * multiplier * seconds),
                        lifetimeLines: state.lifetimeLines + (cps * multiplier * seconds)
                    }));
                }
                cleanupBugs();
            },

            buyUpgrade: (id) => {
                set((state) => {
                    const upgradeIndex = state.upgrades.findIndex((u) => u.id === id);
                    if (upgradeIndex === -1) return state;

                    const upgrade = state.upgrades[upgradeIndex];
                    const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.count));

                    if (state.linesOfCode >= cost) {
                        const newUpgrades = [...state.upgrades];
                        newUpgrades[upgradeIndex] = { ...upgrade, count: upgrade.count + 1 };

                        // Recalculate CPS
                        const newCps = newUpgrades.reduce((acc, u) => acc + (u.baseCps * u.count), 0);

                        return {
                            linesOfCode: state.linesOfCode - cost,
                            upgrades: newUpgrades,
                            cps: newCps,
                        };
                    }
                    return state;
                });
            },

            // --- Bug Bounty Mechanics ---
            bugs: [],

            spawnBug: () => {
                set((state) => {
                    if (state.bugs.length >= 3) return state; // Max 3 active bugs
                    const newBug: Bug = {
                        id: Math.random().toString(36).substr(2, 9),
                        x: Math.random() * 80 + 10, // 10% to 90%
                        y: Math.random() * 80 + 10,
                        createdAt: Date.now(),
                    };
                    return { bugs: [...state.bugs, newBug] };
                });
            },

            catchBug: (id) => {
                set((state) => {
                    const bugExists = state.bugs.find(b => b.id === id);
                    if (!bugExists) return state;

                    // Bonus Calculation: 20x CPS or 500 lines, whichever is higher
                    const bonus = Math.max(state.cps * 20, 500);

                    return {
                        bugs: state.bugs.filter(b => b.id !== id),
                        linesOfCode: state.linesOfCode + bonus
                    };
                });
            },

            cleanupBugs: () => {
                // Remove bugs older than 5 seconds
                const now = Date.now();
                set((state) => ({
                    bugs: state.bugs.filter(b => now - b.createdAt < 5000)
                }));
            },

            reset: () => {
                set({ linesOfCode: 0, cps: 0, clickPower: 1, upgrades: INITIAL_UPGRADES, bugs: [] });
            },

            // --- Prestige (Git Push) Mechanics ---

            getPrestigeGain: () => {
                const state = get();
                // Formula: 1 Commit for every 100,000 LoC earned in this run. 
                // A bit more complex: Math.floor(Math.pow(state.linesOfCode / 100000, 0.5))? 
                // Let's stick to linear for now to keep it understandable: 1 Commit / 50k LoC
                if (state.linesOfCode < 50000) return 0;
                return Math.floor(state.linesOfCode / 50000);
            },

            prestige: () => {
                set((state) => {
                    const gain = Math.floor(state.linesOfCode / 50000);
                    if (gain <= 0) return state;

                    return {
                        // Reset Run
                        linesOfCode: 0,
                        cps: 0,
                        clickPower: 1, // Base click power
                        upgrades: INITIAL_UPGRADES,
                        bugs: [],

                        // Gain Prestige
                        commits: state.commits + gain,
                        lifetimeLines: state.lifetimeLines + state.linesOfCode,
                    };
                });
            },
        }),
        {
            name: 'clicker-storage',
            partialize: (state) => ({
                linesOfCode: state.linesOfCode,
                cps: state.cps,
                upgrades: state.upgrades,
                commits: state.commits,
                lifetimeLines: state.lifetimeLines,
                // Do not persist active bugs
            }),
        }
    )
);
