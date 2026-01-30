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

            click: () => {
                set((state) => ({ linesOfCode: state.linesOfCode + state.clickPower }));
            },

            tick: (seconds) => {
                const { cps, cleanupBugs } = get();
                if (cps > 0) {
                    set((state) => ({ linesOfCode: state.linesOfCode + cps * seconds }));
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
        }),
        {
            name: 'clicker-storage',
            partialize: (state) => ({
                linesOfCode: state.linesOfCode,
                cps: state.cps,
                upgrades: state.upgrades,
                // Do not persist active bugs
            }),
        }
    )
);
