import GameLayout from './layout/GameLayout';
import CyberLayout from './layout/CyberLayout';
import PromotionModal from './components/PromotionModal';
import { useThemeStore } from './store/themeStore';
import { useGameStore } from './store/gameStore';
import { useEffect } from 'react';

function App() {
  const { theme } = useThemeStore();
  const { gameMode } = useGameStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <PromotionModal />
      {gameMode === 'secops' ? <CyberLayout /> : <GameLayout />}
    </>
  );
}

export default App;
