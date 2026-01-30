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

interface GameState {
    linesOfCode: number;
    cps: number;
    clickPower: number;
    upgrades: Upgrade[];

    // Actions
    click: () => void;
    tick: (seconds: number) => void;
    buyUpgrade: (id: string) => void;
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
                const { cps } = get();
                if (cps > 0) {
                    set((state) => ({ linesOfCode: state.linesOfCode + cps * seconds }));
                }
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

                        // Recalculate CPS and Click Power
                        const newCps = newUpgrades.reduce((acc, u) => acc + (u.baseCps * u.count), 0);
                        // Example: Every 10 'Mechanical Keyboards' adds 1 click power could be a bonus, but for now simple.
                        // Let's make click power static + manual upgrades if we had them. 
                        // For now, let's say "Fix Typos" adds specific click power? No, generic logic.

                        return {
                            linesOfCode: state.linesOfCode - cost,
                            upgrades: newUpgrades,
                            cps: newCps,
                        };
                    }
                    return state;
                });
            },

            reset: () => {
                set({ linesOfCode: 0, cps: 0, clickPower: 1, upgrades: INITIAL_UPGRADES });
            },
        }),
        {
            name: 'clicker-storage',
        }
    )
);
