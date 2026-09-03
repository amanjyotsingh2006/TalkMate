import { CheckIcon, PaletteIcon } from "lucide-react";
import { useThemeStore } from "../Store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="theme-dropdown dropdown dropdown-end">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .theme-dropdown { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Fraunces', serif; }
        .trigger-btn { color: #8A968E; transition: background 0.2s ease, color 0.2s ease; }
        .trigger-btn:hover { background: #101B15; color: #F3F1EA; }
        .panel {
          background: #0F1A14;
          border: 1px solid #1D2C22;
        }
        .icon-badge { background: rgba(143,227,136,0.1); }
        .theme-row { transition: background 0.2s ease, color 0.2s ease; }
        .theme-row:hover:not(.row-active) { background: #101B15; }
        .row-active { background: rgba(143,227,136,0.1); color: #8FE388; }
        .swatch-badge { background: #101B15; }
        .swatch-badge-active { background: rgba(143,227,136,0.15); }
      `}</style>

      <button
        type="button"
        tabIndex={0}
        aria-label="Select theme"
        className="trigger-btn flex size-10 items-center justify-center rounded-xl"
      >
        <PaletteIcon className="size-5" />
      </button>

      <div
        tabIndex={0}
        className="panel dropdown-content z-50 mt-3 max-h-[360px] w-64 overflow-y-auto rounded-2xl p-2 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 pb-2 pt-2">
          <div className="icon-badge flex size-8 items-center justify-center rounded-lg">
            <PaletteIcon className="size-4 text-[#8FE388]" />
          </div>
          <div>
            <h3 className="font-display text-sm text-[#F3F1EA]">Appearance</h3>
            <p className="text-[11px] text-[#6F7D74]">Choose your theme</p>
          </div>
        </div>

        <div className="my-1 h-px bg-[#1D2C22]" />

        {/* Themes */}
        <div className="space-y-1">
          {THEMES.map(({ name, colors }) => {
            const isSelected = theme === name;

            return (
              <button
                key={name}
                type="button"
                onClick={() => setTheme(name)}
                className={`theme-row flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${
                  isSelected ? "row-active" : "text-[#8A968E]"
                }`}
              >
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${
                    isSelected ? "swatch-badge-active" : "swatch-badge"
                  }`}
                >
                  <PaletteIcon className="size-4" />
                </div>

                <span className="flex-1 text-sm font-medium">{name}</span>

                <div className="flex gap-1">
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="size-2.5 rounded-full ring-1 ring-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {isSelected && <CheckIcon className="size-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;