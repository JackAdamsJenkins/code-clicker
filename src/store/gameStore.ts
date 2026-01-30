import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SkillDef {
    id: string;
    name: string;
    description: string;
    cooldown: number; // seconds
    duration?: number; // seconds
    icon?: string;
}

export type GameMode = 'dev' | 'secops';

export interface SecOpsUpgrade {
    id: string;
    name: string;
    baseCost: number;
    baseEps: number; // Entropy per second
    count: number;
    description: string;
}

export interface SkillState {
    activeTimeRemaining: number;
    cooldownRemaining: number;
}

export const SKILLS: SkillDef[] = [
    { id: 's1', name: 'Coffee Break', description: 'Double CPS for 30s', cooldown: 300, duration: 30, icon: 'Coffee' },
    { id: 's2', name: 'Hackathon', description: 'Click Power x10 for 10s', cooldown: 600, duration: 10, icon: 'Zap' },
    { id: 's3', name: 'Stack Overflow', description: '+10% LoC instantly, triggers bugs. Active bugs reduce CPS by 20%!', cooldown: 900, duration: 0, icon: 'Bug' },
];

export interface TalentDef {
    id: string;
    branch: 'frontend' | 'backend' | 'devops';
    name: string;
    description: string;
    baseCost: number;
    maxLevel: number;
    effectDesc: (level: number) => string;
}

export const TALENT_TREE: TalentDef[] = [
    // Frontend
    {
        id: 't_f1', branch: 'frontend', name: 'Hydration Optimization',
        description: 'Increases Click Power by 50% per level.',
        baseCost: 1, maxLevel: 10,
        effectDesc: (l) => `+${l * 50}% Click Power`
    },
    {
        id: 't_f2', branch: 'frontend', name: 'Component Memoization',
        description: 'Active Skills last 20% longer per level.',
        baseCost: 2, maxLevel: 5,
        effectDesc: (l) => `+${l * 20}% Duration`
    },
    // Backend
    {
        id: 't_b1', branch: 'backend', name: 'Microservices',
        description: 'Increases Passive Income (CPS) by 25% per level.',
        baseCost: 1, maxLevel: 10,
        effectDesc: (l) => `+${l * 25}% CPS`
    },
    {
        id: 't_b2', branch: 'backend', name: 'Load Balancing',
        description: 'Reduces passive bug penalty effectiveness.',
        baseCost: 3, maxLevel: 5,
        effectDesc: (l) => `-${l * 10}% Bug Penalty`
    },
    // DevOps
    {
        id: 't_d1', branch: 'devops', name: 'Containerization',
        description: 'Reduces Upgrade Costs by 5% per level.',
        baseCost: 2, maxLevel: 10,
        effectDesc: (l) => `-${l * 5}% Upgrade Cost`
    },
    {
        id: 't_d2', branch: 'devops', name: 'CI/CD Pipeline',
        description: 'Gain +10% more Commits on Prestige per level.',
        baseCost: 5, maxLevel: 5,
        effectDesc: (l) => `+${l * 10}% Prestige Gain`
    }
];

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
    skills: Record<string, SkillState>;
    talents: Record<string, number>; // id -> level

    // Start SecOps
    gameMode: GameMode;
    entropy: number;
    lifetimeEntropy: number;
    secOpsUpgrades: SecOpsUpgrade[];
    // End SecOps

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
    getNextCommitCost: () => number;
    prestige: () => void;
    activateSkill: (id: string) => void;
    buyTalent: (id: string) => void;
    getProductionRate: () => number;

    // SecOps Actions
    promoteToSecOps: () => void;
    clickSecOps: () => void;
    buySecOpsUpgrade: (id: string) => void;
    // Debug
    debugSetCommits: (amount: number) => void;
}

const INITIAL_UPGRADES: Upgrade[] = [
    { id: 'u1', name: 'Fix Typos', baseCost: 15, baseCps: 0.1, baseClick: 0, count: 0, description: 'Correct simple mistakes.' },
    { id: 'u2', name: 'Snippets', baseCost: 100, baseCps: 1, baseClick: 0, count: 0, description: 'Copy-paste efficiency.' },
    { id: 'u3', name: 'Linter', baseCost: 1100, baseCps: 8, baseClick: 0, count: 0, description: 'Auto-fix formatting.' },
    { id: 'u4', name: 'Mechanical Keyboard', baseCost: 12000, baseCps: 47, baseClick: 0, count: 0, description: 'Clickity clack!' },
    { id: 'u5', name: 'Pair Programmer', baseCost: 130000, baseCps: 260, baseClick: 0, count: 0, description: 'Two heads are better.' },
    { id: 'u6', name: 'AI Assistant', baseCost: 1400000, baseCps: 1400, baseClick: 0, count: 0, description: 'Code generates itself.' },
];

const INITIAL_SECOPS_UPGRADES: SecOpsUpgrade[] = [
    { id: 'su1', name: 'Script Kiddie', baseCost: 10, baseEps: 1, count: 0, description: 'Basic automated ping scripts.' },
    { id: 'su2', name: 'VPN Tunnel', baseCost: 100, baseEps: 5, count: 0, description: 'Encrypted traffic routing.' },
    { id: 'su3', name: 'Botnet Node', baseCost: 1000, baseEps: 25, count: 0, description: 'Distributed processing power.' },
    { id: 'su4', name: '0-Day Exploit', baseCost: 12500, baseEps: 100, count: 0, description: 'Unpatchable vulnerabilities.' },
    { id: 'su5', name: 'Quantum Decryptor', baseCost: 200000, baseEps: 500, count: 0, description: 'Breaks encryption instantly.' },
    { id: 'su6', name: 'AI Sentinel', baseCost: 3000000, baseEps: 2500, count: 0, description: 'Autonomous defense grid.' },
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
            skills: {},
            talents: {},

            // SecOps Init
            gameMode: 'dev',
            entropy: 0,
            lifetimeEntropy: 0,
            secOpsUpgrades: INITIAL_SECOPS_UPGRADES,

            click: () => {
                set((state) => {
                    const commitMultiplier = 1 + (state.commits * 0.1);

                    // Apply Hackathon Skill (s2)
                    let skillMultiplier = 1;
                    if (state.skills['s2']?.activeTimeRemaining > 0) {
                        skillMultiplier = 10;
                    }

                    // Talent Multiplier (Frontend - t_f1)
                    const f1Level = state.talents['t_f1'] || 0;
                    const talentMultiplier = 1 + (f1Level * 0.5);

                    const totalMultiplier = commitMultiplier * skillMultiplier * talentMultiplier;
                    const gain = state.clickPower * totalMultiplier;

                    return {
                        linesOfCode: state.linesOfCode + gain,
                        lifetimeLines: state.lifetimeLines + gain
                    };
                });
            },

            tick: (seconds) => {
                const { gameMode } = get();

                if (gameMode === 'secops') {
                    const { secOpsUpgrades } = get();
                    const eps = secOpsUpgrades.reduce((acc, u) => acc + (u.baseEps * u.count), 0);

                    if (eps > 0) {
                        set((state) => ({
                            entropy: state.entropy + (eps * seconds),
                            lifetimeEntropy: state.lifetimeEntropy + (eps * seconds)
                        }));
                    }
                    return;
                }

                const { cps, cleanupBugs, commits, skills } = get();

                // Update Skills Timers
                let newSkills = { ...skills };
                let skillsChanged = false;

                Object.keys(newSkills).forEach(key => {
                    const s = newSkills[key];
                    if (s.activeTimeRemaining > 0 || s.cooldownRemaining > 0) {
                        skillsChanged = true;
                        newSkills[key] = {
                            activeTimeRemaining: Math.max(0, s.activeTimeRemaining - seconds),
                            cooldownRemaining: Math.max(0, s.cooldownRemaining - seconds)
                        };
                    }
                });

                // Calculate Multipliers
                const commitMultiplier = 1 + (commits * 0.1);

                // Active Bug Penalty: Each bug reduces production by 20%  
                const bugPenalty = get().bugs.length > 0 ? (1 - (0.2 * get().bugs.length)) : 1;
                // Clamp penalty to 0 to avoid negative generation
                const effectiveBugPenalty = Math.max(0, bugPenalty);

                // Apply Coffee Break Skill (s1)
                let skillCpsMultiplier = 1;
                if (newSkills['s1']?.activeTimeRemaining > 0) {
                    skillCpsMultiplier = 2;
                }

                // Talent Multiplier (Backend - t_b1)
                const b1Level = get().talents['t_b1'] || 0;
                const talentMultiplier = 1 + (b1Level * 0.25);

                const finalMultiplier = commitMultiplier * skillCpsMultiplier * effectiveBugPenalty * talentMultiplier;

                if (cps > 0) {
                    set((state) => ({
                        linesOfCode: state.linesOfCode + (cps * finalMultiplier * seconds),
                        lifetimeLines: state.lifetimeLines + (cps * finalMultiplier * seconds),
                        skills: skillsChanged ? newSkills : state.skills
                    }));
                } else if (skillsChanged) {
                    set({ skills: newSkills });
                }

                cleanupBugs();
            },

            activateSkill: (id) => {
                const { skills, linesOfCode } = get();
                const skillDef = SKILLS.find(s => s.id === id);
                if (!skillDef) return;

                const currentSkillState = skills[id] || { activeTimeRemaining: 0, cooldownRemaining: 0 };
                if (currentSkillState.cooldownRemaining > 0) return; // On cooldown

                // Apply Immediate Effects
                if (id === 's3') { // Stack Overflow
                    const bonus = linesOfCode * 0.10;
                    // Trigger spawns
                    const spawnBug = get().spawnBug;
                    setTimeout(() => spawnBug(), 100);
                    setTimeout(() => spawnBug(), 300);
                    setTimeout(() => spawnBug(), 500);

                    set((state) => ({
                        linesOfCode: state.linesOfCode + bonus,
                        lifetimeLines: state.lifetimeLines + bonus
                    }));
                }

                // Set State
                // Talent Duration Bonus (Frontend - t_f2)
                // Note: We need to check talents here properly
                const talentDurationMult = 1 + ((get().talents['t_f2'] || 0) * 0.2);

                set((state) => ({
                    skills: {
                        ...state.skills,
                        [id]: {
                            activeTimeRemaining: (skillDef.duration || 0) * talentDurationMult,
                            cooldownRemaining: skillDef.cooldown
                        }
                    }
                }));
            },

            buyUpgrade: (id) => {
                set((state) => {
                    const upgradeIndex = state.upgrades.findIndex((u) => u.id === id);
                    if (upgradeIndex === -1) return state;

                    const upgrade = state.upgrades[upgradeIndex];

                    // Talent Discount (DevOps - t_d1)
                    const d1Level = state.talents['t_d1'] || 0;
                    const discount = 1 - Math.min(0.5, d1Level * 0.05); // Max 50% discount cap safely

                    const cost = Math.floor((upgrade.baseCost * Math.pow(1.15, upgrade.count)) * discount);

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

            buyTalent: (id) => {
                set((state) => {
                    const talentDef = TALENT_TREE.find(t => t.id === id);
                    if (!talentDef) return state;

                    const currentLevel = state.talents[id] || 0;
                    if (currentLevel >= talentDef.maxLevel) return state;

                    const cost = talentDef.baseCost;

                    if (state.commits >= cost) {
                        return {
                            commits: state.commits - cost,
                            talents: {
                                ...state.talents,
                                [id]: currentLevel + 1
                            }
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
                set({ linesOfCode: 0, cps: 0, clickPower: 1, upgrades: INITIAL_UPGRADES, bugs: [], skills: {} });
            },

            // --- Prestige (Git Push) Mechanics ---

            getPrestigeGain: () => {
                const state = get();
                const MAX_COMMITS = 3000; // Hard Cap to prevent Infinity cost
                const MAX_PRESTIGE_GAIN = 1000; // Max per run to prevent skipping progression too fast

                if (state.commits >= MAX_COMMITS) return 0;

                // Magic formula for geometric series sum inverse
                const r = 1.15;
                const base = 50000;
                const currentCommits = state.commits;

                // Optimization: If we can't afford the very next one
                const nextCost = base * Math.pow(r, currentCommits);
                if (state.linesOfCode < nextCost) return 0;

                // N = log_r ( (Lines * (r - 1) / (Base * r^Commits)) + 1 )
                const numerator = state.linesOfCode * (r - 1);
                // Safe check for denominator
                const denominator = base * Math.pow(r, currentCommits);
                if (!isFinite(denominator) || denominator === 0) return 0;

                const val = (numerator / denominator) + 1;

                let rawGain = Math.floor(Math.log(val) / Math.log(r));

                // 2. Talent Multiplier (DevOps - t_d2: +10% Prestige Gain)
                const d2Level = state.talents['t_d2'] || 0;
                const talentMultiplier = 1 + (d2Level * 0.1);

                let totalGain = Math.floor(rawGain * talentMultiplier);

                // Apply Caps
                totalGain = Math.min(totalGain, MAX_PRESTIGE_GAIN);
                const spaceLeft = MAX_COMMITS - state.commits;
                return Math.min(totalGain, spaceLeft);
            },

            getNextCommitCost: () => {
                const state = get();
                const MAX_COMMITS = 3000;
                if (state.commits >= MAX_COMMITS) return -1; // Maxed

                const r = 1.15;
                const base = 50000;
                const cost = Math.floor(base * Math.pow(r, state.commits));
                return isFinite(cost) ? cost : -1;
            },

            prestige: () => {
                const gain = get().getPrestigeGain();
                if (gain <= 0) return;

                set((state) => ({
                    // Reset Run
                    linesOfCode: 0,
                    cps: 0,
                    clickPower: 1, // Base click power
                    upgrades: INITIAL_UPGRADES,
                    bugs: [],
                    skills: {},

                    // Gain Prestige
                    commits: state.commits + gain,
                    lifetimeLines: state.lifetimeLines + state.linesOfCode,
                }));
            },

            getProductionRate: () => {
                const { cps, commits, skills, talents, bugs } = get();

                // 1. Commit Multiplier
                const commitMultiplier = 1 + (commits * 0.1);

                // 2. Bug Penalty
                const bugPenalty = bugs.length > 0 ? (1 - (0.2 * bugs.length)) : 1;
                const effectiveBugPenalty = Math.max(0, bugPenalty);

                // 3. Skill Multiplier (Coffee Break - s1)
                let skillCpsMultiplier = 1;
                if (skills['s1']?.activeTimeRemaining > 0) {
                    skillCpsMultiplier = 2;
                }

                // 4. Talent Multiplier (Backend - t_b1)
                const b1Level = talents['t_b1'] || 0;
                const talentMultiplier = 1 + (b1Level * 0.25);

                return cps * commitMultiplier * skillCpsMultiplier * effectiveBugPenalty * talentMultiplier;
            },

            promoteToSecOps: () => {
                set({
                    gameMode: 'secops',
                    entropy: 0,
                    linesOfCode: 0, // Reset old resource or keep it? Let's keep it but it's not used
                    // We can reset other things if we want a hard switch
                });
            },

            clickSecOps: () => {
                set((state) => ({
                    entropy: state.entropy + 1, // Base click for now
                    lifetimeEntropy: state.lifetimeEntropy + 1
                }));
            },

            buySecOpsUpgrade: (id) => {
                set((state) => {
                    const upgradeIndex = state.secOpsUpgrades.findIndex((u) => u.id === id);
                    if (upgradeIndex === -1) return state;

                    const upgrade = state.secOpsUpgrades[upgradeIndex];
                    const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.count));

                    if (state.entropy >= cost) {
                        const newUpgrades = [...state.secOpsUpgrades];
                        newUpgrades[upgradeIndex] = { ...upgrade, count: upgrade.count + 1 };

                        return {
                            entropy: state.entropy - cost,
                            secOpsUpgrades: newUpgrades,
                        };
                    }
                    return state;
                });
            },

            // Debug
            debugSetCommits: (amount) => set({ commits: amount }),
        }),
        {
            name: 'clicker-storage',
            version: 2, // Bump version to force reset
            partialize: (state) => ({
                linesOfCode: state.linesOfCode,
                cps: state.cps,
                upgrades: state.upgrades,
                commits: state.commits,
                lifetimeLines: state.lifetimeLines,
                skills: state.skills,
                talents: state.talents,
                gameMode: state.gameMode,
                entropy: state.entropy,
                lifetimeEntropy: state.lifetimeEntropy,
                secOpsUpgrades: state.secOpsUpgrades,
            }),
        }
    )
);
