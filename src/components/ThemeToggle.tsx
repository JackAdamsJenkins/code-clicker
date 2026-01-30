import { Terminal, Zap } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-background/80 border border-primary text-primary transition-all duration-300 hover:shadow-[0_0_20px_var(--color-primary)] active:scale-95 backdrop-blur-sm cursor-pointer"
            title={theme === 'light' ? 'Switch to Hacker Mode' : 'Switch to Cyberpunk Mode'}
        >
            {theme === 'light' ? (
                <Terminal size={20} className="drop-shadow-[0_0_5px_var(--color-primary)]" />
            ) : (
                <Zap size={20} className="drop-shadow-[0_0_5px_var(--color-primary)]" />
            )}
        </button>
    );
}
