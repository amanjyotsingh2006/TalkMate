import { ShipWheelIcon } from "lucide-react";
import { useThemeStore } from "../Store/useThemeStore";

const LIVE_LEARNERS = [
  { initials: "MK", bg: "#8FE388" },
  { initials: "RS", bg: "#FF9E7D" },
  { initials: "AT", bg: "#7DB8E8" },
];

const AuthLayout = ({ children, panelTitle, panelText }) => {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme} className="login-root min-h-[100dvh] w-full relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');

        .login-root {
          background: radial-gradient(120% 100% at 15% 0%, #142219 0%, #0B1410 55%), #0B1410;
          font-family: 'Inter', sans-serif;
        }
        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.05;
          mix-blend-mode: overlay;
          z-index: 0;
        }
        .font-display { font-family: 'Fraunces', serif; }

        .field-box {
          background: #101B15;
          border: 1.5px solid #223229;
          border-radius: 14px;
          padding: 0.85rem 1rem;
          color: #F3F1EA;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
          font-size: 16px; /* stops iOS zooming into the field */
        }
        .field-box::placeholder { color: #4A5A50; }
        .field-box:focus {
          outline: none;
          border-color: #8FE388;
          box-shadow: 0 0 0 3px rgba(143,227,136,0.12);
        }
        .eye-btn { color: #4A5A50; transition: color 0.2s ease; }
        .eye-btn:hover { color: #8FE388; }

        .divider-line { flex: 1; height: 1px; background: #223229; }

        @keyframes drift {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-14px) translateX(6px); }
        }
        .float-card { animation: drift 7s ease-in-out infinite; }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(143, 227, 136, 0.5); }
          100% { box-shadow: 0 0 0 8px rgba(143, 227, 136, 0); }
        }
        .live-dot { animation: pulse-ring 2s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .float-card, .live-dot { animation: none; }
        }

        .cta-btn {
          box-shadow: 0 1px 0 rgba(255,255,255,0.15) inset;
          transition: transform 0.15s ease, box-shadow 0.25s ease, background 0.2s ease;
        }
        .cta-btn:hover:not(:disabled) {
          box-shadow: 0 0 0 1px rgba(143,227,136,0.4), 0 10px 30px -8px rgba(143,227,136,0.45);
        }
        .cta-btn:active:not(:disabled) { transform: scale(0.98); }
      `}</style>

      <svg className="grain">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col items-center justify-center gap-10 px-5 py-10 lg:flex-row lg:gap-16">
        {/* Left Side — the form */}
        <div className="w-full max-w-md lg:max-w-none lg:w-1/2">
          <div className="flex items-center gap-2 mb-10">
            <ShipWheelIcon className="size-7 text-[#8FE388]" />
            <span className="font-display text-2xl text-[#F3F1EA]">Streamify</span>
          </div>

          {children}
        </div>

        {/* Right Side — showcase panel (desktop only) */}
        <div className="hidden lg:block relative w-full lg:w-1/2 aspect-[4/5] rounded-3xl overflow-hidden border border-[#1D2C22]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#132018] to-[#0B1410]" />
          <div
            className="absolute w-[420px] h-[420px] rounded-full blur-[90px] opacity-25"
            style={{ background: "#8FE388", top: "10%", left: "15%" }}
          />
          <div
            className="absolute w-[280px] h-[280px] rounded-full blur-[80px] opacity-20"
            style={{ background: "#7DB8E8", bottom: "10%", right: "0%" }}
          />

          <svg
            className="absolute inset-0 w-full h-full opacity-60"
            viewBox="0 0 100 125"
            preserveAspectRatio="none"
          >
            <ellipse cx="50" cy="55" rx="34" ry="34" fill="none" stroke="#3D4F45" strokeWidth="0.3" />
            <ellipse cx="50" cy="55" rx="34" ry="13" fill="none" stroke="#3D4F45" strokeWidth="0.25" />
            <ellipse cx="50" cy="55" rx="13" ry="34" fill="none" stroke="#3D4F45" strokeWidth="0.25" />
            <line x1="14" y1="20" x2="40" y2="42" stroke="#3D4F45" strokeWidth="0.3" />
            <line x1="86" y1="30" x2="62" y2="48" stroke="#3D4F45" strokeWidth="0.3" />
          </svg>

          {LIVE_LEARNERS.map((p, i) => (
            <div
              key={i}
              className="float-card absolute w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold text-[#0B1410] border-2 border-[#0B1410] shadow-lg"
              style={{
                background: p.bg,
                top: ["18%", "48%", "30%"][i],
                left: ["70%", "12%", "42%"][i],
                animationDelay: `${i * 0.9}s`,
              }}
            >
              {p.initials}
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex -space-x-2">
                {LIVE_LEARNERS.map((p, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-[#0B1410] border-2 border-[#0B1410]"
                    style={{ background: p.bg }}
                  >
                    {p.initials}
                  </div>
                ))}
              </div>
              <span className="relative flex items-center gap-1.5 text-[12px] text-[#8A968E]">
                <span className="live-dot w-1.5 h-1.5 rounded-full bg-[#8FE388]" />
                214 practicing right now
              </span>
            </div>

            <h2 className="font-display text-2xl text-[#F3F1EA] leading-snug mb-2">
              {panelTitle}
            </h2>
            <p className="text-[14px] text-[#8A968E] max-w-xs leading-relaxed">
              {panelText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;