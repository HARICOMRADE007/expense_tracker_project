import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${isDark
          ? 'bg-gray-800/90 text-yellow-400 hover:bg-gray-700'
          : 'bg-white/90 text-blue-600 hover:bg-white'
        } backdrop-blur-xl border ${isDark ? 'border-gray-700' : 'border-white/20'}`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}
