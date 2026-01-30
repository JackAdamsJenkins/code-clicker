# Clicker Game Implementation Plan

## Overview
Develop a "Cookie Clicker" style incremental game where the user clicks on "Lines of Code".
**Design Theme**: Minimalist, clean, airy.
**Palette**: Green (primary), White (background), Light Gray (accents).
**Visuals**: Floating syntax highlighted code fragments, terminal-like aesthetics but clean (not retro-CRT).

## Project Type
WEB

## Success Criteria
- [ ] Click mechanic works (generating lines of code).
- [ ] Passive income (CPS) works.
- [ ] Upgrades (e.g., "Refactoring", "New Keyboard", "AI Assistant") purchaseable.
- [ ] Game saves state to localStorage.
- [ ] Design matches "Minimalist Green/White" requirements.
- [ ] Passes `checklist.py`.

## Tech Stack
- **Framework**: React + TypeScript (Vite)
- **State**: Zustand (Store, Persistence)
- **Styling**: Tailwind CSS (Custom palette, no purple)
- **Animation**: Framer Motion (for "Wow" effect)
- **Icons**: Lucide React

## File Structure
- src/store/gameStore.ts
- src/components/ClickArea.tsx
- src/components/UpgradePanel.tsx
- src/components/StatsHeader.tsx
- src/layout/GameLayout.tsx

## Task Breakdown
- [x] **Init**: `npm create vite@latest . -- --template react-ts` & install deps. → Verify: `npm run dev` works.
- [x] **Config**: Setup Tailwind theme. → Verify: Styles apply.
- [x] **Store**: Create `useGameStore`. → Verify: State updates.
- [x] **Game Loop**: Implement `useInterval`. → Verify: Resources grow.
- [x] **UI - Hero**: Build `ClickArea` with particle effects. → Verify: Visuals trigger.
- [x] **UI - Shop**: Build `UpgradePanel`. → Verify: Can buy items.
- [x] **UI - Skills**: Build `SkillPanel` with Active Skills (Option B). → Verify: Cooldowns & Effects work.
- [x] **Persistence**: Add Zustand persist middleware. → Verify: State survives reload.

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Build: ✅ Pass
- Browser Verify: ⚠️ Environment limitation (User to verify)
- Date: 2026-01-30
