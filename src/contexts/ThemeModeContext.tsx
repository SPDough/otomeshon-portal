import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

type ThemeMode = 'light' | 'dark';
type DensityMode = 'comfortable' | 'compact';

interface ThemeModeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  density: DensityMode;
  toggleDensity: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType>({
  mode: 'light',
  toggleMode: () => {},
  density: 'comfortable',
  toggleDensity: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  const [density, setDensity] = useState<DensityMode>(() => {
    const saved = localStorage.getItem('theme-density');
    return (saved === 'compact' || saved === 'comfortable') ? saved : 'comfortable';
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('theme-density', density);
  }, [density]);

  const value = useMemo(() => ({
    mode,
    toggleMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    density,
    toggleDensity: () => setDensity((prev) => (prev === 'comfortable' ? 'compact' : 'comfortable')),
  }), [mode, density]);

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};
