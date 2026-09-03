import { useState } from "react";
import { ShipWheelIcon, Eye, EyeOff, ArrowRight, MessageCircle, Video, Repeat } from "lucide-react";
import { Link } from "react-router";

import useSignup from "../hooks/useSignup.js";
import { useThemeStore } from "../Store/useThemeStore.js";

// People "in conversation" right now — the app's signature moment on the right panel.
const LIVE_PEOPLE = [
  { name: "Ananya", status: "Learning Spanish", bg: "#FF9E7D", top: "8%", left: "2%", accent: "#FF9E7D" },
  { name: "Sofia", status: "Learning English", bg: "#8FE388", top: "28%", left: "48%", accent: "#8FE388" },
  { name: "James", status: "Learning Hindi", bg: "#7DB8E8", top: "62%", left: "6%", accent: "#7DB8E8" },
];

const FEATURE_PILLS = [
  { icon: MessageCircle, label: "Real-time chat", color: "#FF9E7D", top: "58%", left: "62%" },
  { icon: Video, label: "Video calls", color: "#8FE388", top: "70%", left: "58%" },
  { icon: Repeat, label: "Language exchange", color: "#F3F1EA", top: "82%", left: "50%" },
];

const SignupPage = () => {
  const { theme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    agreed: false,
  });

  const { isPending, error, signupMutation } = useSignup();

  const handleChange = (field) => (e) => {
    const value = field === "agreed" ? e.target.checked : e.target.value;
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div data-theme={theme} className="signup-root min-h-screen w-full relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');

        .signup-root {
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
        }
        .field-box::placeholder { color: #4A5A50; }
        .field-box:focus {
          outline: none;
          border-color: #8FE388;
          box-shadow: 0 0 0 3px rgba(143,227,136,0.12);
        }
        .eye-btn {
          color: #4A5A50;
          transition: color 0.2s ease;
        }
        .eye-btn:hover { color: #8FE388; }

        @keyframes drift {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-14px) translateX(6px); }
        }
        .float-card {
          animation: drift 7s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(143, 227, 136, 0.45); }
          100% { box-shadow: 0 0 0 14px rgba(143, 227, 136, 0); }
        }
        .live-dot { animation: pulse-ring 2s ease-out infinite; }
        .core-glow {
          animation: pulse-ring 2.6s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .float-card, .live-dot, .core-glow { animation: none; }
        }

        .check-box {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 1.5px solid #3D4F45;
          border-radius: 5px;
          display: inline-grid;
          place-content: center;
          cursor: pointer;
          flex-shrink: 0;
          background: #101B15;
        }
        .check-box:checked { background: #8FE388; border-color: #8FE388; }
        .check-box:checked::after {
          content: "";
          width: 5px;
          height: 9px;
          border: solid #0B1410;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg) translate(-1px, -1px);
        }

        .cta-btn {
          box-shadow: 0 1px 0 rgba(255,255,255,0.15) inset;
          transition: transform 0.15s ease, box-shadow 0.25s ease, background 0.2s ease;
        }
        .cta-btn:hover:not(:disabled) {
          box-shadow: 0 0 0 1px rgba(143,227,136,0.4), 0 12px 32px -8px rgba(143,227,136,0.5);
        }
        .cta-btn:active:not(:disabled) { transform: scale(0.98); }
        .cta-btn:hover:not(:disabled) .cta-arrow { transform: translateX(3px); }
        .cta-arrow { transition: transform 0.2s ease; }
      `}</style>

      <svg className="grain">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row w-full max-w-6xl mx-auto px-5 py-10 gap-10 lg:gap-16 items-center">
        {/* Left Side — the form */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center gap-2 mb-10">
            <ShipWheelIcon className="size-7 text-[#8FE388]" />
            <span className="font-display text-2xl text-[#F3F1EA]">Streamify</span>
          </div>

          <p className="text-[13px] text-[#6F7D74] mb-3 tracking-wide uppercase">Language exchange, live</p>
          <h1 className="font-display text-4xl md:text-[3.1rem] leading-[1.06] text-[#F3F1EA] mb-4">
            Meet people.
            <br />
            <span className="text-[#8FE388]">Speak freely.</span>
          </h1>
          <p className="text-[#8A968E] text-[15px] mb-9 max-w-sm leading-relaxed">
            Join a table of language partners from six continents and start
            practicing today.
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[#2A1616] border border-[#5C2B2B] text-[#E8A0A0] text-sm">
              {error.response?.data?.message || error.message}
            </div>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#8A968E]">Full name</label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                required
                value={signupData.fullName}
                onChange={handleChange("fullName")}
                className="field-box"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#8A968E]">Email address</label>
              <input
                type="email"
                placeholder="hello@example.com"
                required
                value={signupData.email}
                onChange={handleChange("email")}
                className="field-box"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#8A968E]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  value={signupData.password}
                  onChange={handleChange("password")}
                  className="field-box pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="eye-btn absolute right-3.5 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 mt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                className="check-box mt-0.5"
                required
                checked={signupData.agreed}
                onChange={handleChange("agreed")}
              />
              <span className="text-[13px] text-[#8A968E] leading-relaxed">
                I agree to the{" "}
                <span className="text-[#8FE388]">Terms of Service</span> and{" "}
                <span className="text-[#8FE388]">Privacy Policy</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="cta-btn w-full mt-2 h-12 rounded-full bg-[#8FE388] text-[#0B1410] font-semibold text-[15px] hover:bg-[#A6EC9E] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="cta-arrow size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-[14px] text-[#8A968E]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#8FE388] font-medium">
              Log in
            </Link>
          </p>
        </div>

        {/* Right Side — the signature moment */}
        <div className="hidden lg:block relative w-full lg:w-1/2 aspect-[4/5] rounded-3xl overflow-hidden border border-[#1D2C22]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#132018] to-[#0B1410]" />
          <div
            className="absolute w-[420px] h-[420px] rounded-full blur-[90px] opacity-25"
            style={{ background: "#8FE388", top: "30%", left: "25%" }}
          />
          <div
            className="absolute w-[280px] h-[280px] rounded-full blur-[80px] opacity-20"
            style={{ background: "#FF9E7D", bottom: "5%", right: "5%" }}
          />

          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 125" preserveAspectRatio="none">
            <line x1="20" y1="14" x2="50" y2="46" stroke="#3D4F45" strokeWidth="0.3" />
            <line x1="50" y1="46" x2="22" y2="70" stroke="#3D4F45" strokeWidth="0.3" />
            <line x1="50" y1="46" x2="75" y2="60" stroke="#3D4F45" strokeWidth="0.3" />
          </svg>

          {/* central pulsing core */}
          <div
            className="core-glow absolute rounded-full flex items-center justify-center font-display text-xl text-[#8FE388] border border-[#2A3A32] bg-[#0F1A14]/70 backdrop-blur-sm"
            style={{ top: "42%", left: "38%", width: "110px", height: "110px" }}
          >
            public
          </div>

          {/* floating person cards */}
          {LIVE_PEOPLE.map((p, i) => (
            <div
              key={i}
              className="float-card absolute flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#0F1A14]/80 border backdrop-blur-sm"
              style={{ top: p.top, left: p.left, borderColor: p.accent, animationDelay: `${i * 0.8}s` }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-[#0B1410]"
                style={{ background: p.bg }}
              >
                {p.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#F3F1EA] leading-tight">{p.name}</p>
                <p className="text-[11px] text-[#8A968E] leading-tight">{p.status}</p>
              </div>
            </div>
          ))}

          {/* feature pills */}
          {FEATURE_PILLS.map((f, i) => (
            <div
              key={i}
              className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F1A14]/70 border border-[#2A3A32] backdrop-blur-sm text-[11px]"
              style={{ top: f.top, left: f.left, color: f.color }}
            >
              <f.icon className="size-3.5" />
              {f.label}
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 p-9 pb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-[#8FE388]" />
              <span className="text-[12px] text-[#8A968E]">214 practicing right now</span>
            </div>
            <h2 className="font-display text-xl text-[#F3F1EA] leading-snug">
              Every conversation starts with hello.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;