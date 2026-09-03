import { useState } from "react";
import { Link } from "react-router";
import { ShipWheelIcon, Mail, Lock, Eye, EyeOff } from "lucide-react";

import useLogin from "../hooks/useLogin";
import { useThemeStore } from "../Store/useThemeStore";

const LIVE_LEARNERS = [
  { initials: "MK", bg: "#8FE388" },
  { initials: "RS", bg: "#FF9E7D" },
  { initials: "AT", bg: "#7DB8E8" },
];

const LoginPage = () => {
  const { theme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { error, isPending, loginMutation } = useLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div data-theme={theme} className="login-root min-h-screen w-full relative">
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
        }
        .field-box::placeholder { color: #4A5A50; }
        .field-box:focus {
          outline: none;
          border-color: #8FE388;
          box-shadow: 0 0 0 3px rgba(143,227,136,0.12);
        }
        .eye-btn { color: #4A5A50; transition: color 0.2s ease; }
        .eye-btn:hover { color: #8FE388; }

        .check-box {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 1.5px solid #3D4F45;
          border-radius: 4px;
          display: inline-grid;
          place-content: center;
          cursor: pointer;
          flex-shrink: 0;
          background: #101B15;
        }
        .check-box:checked { background: #8FE388; border-color: #8FE388; }
        .check-box:checked::after {
          content: "";
          width: 4.5px;
          height: 8px;
          border: solid #0B1410;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg) translate(-1px, -1px);
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #223229;
        }

        .google-btn {
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .google-btn:hover {
          border-color: #3D4F45;
          background: #101B15;
        }

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

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-10 px-5 py-10 lg:flex-row lg:gap-16">
        {/* Left Side — the form */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center gap-2 mb-10">
            <ShipWheelIcon className="size-7 text-[#8FE388]" />
            <span className="font-display text-2xl text-[#F3F1EA]">Streamify</span>
          </div>

          <p className="text-[13px] text-[#6F7D74] mb-3 tracking-wide uppercase">Pick up where you left off</p>
          <h1 className="font-display text-4xl md:text-[3rem] leading-[1.08] text-[#F3F1EA] mb-4">
            Welcome back
          </h1>
          <p className="text-[#8A968E] text-[15px] mb-9 max-w-sm leading-relaxed">
            Sign in to your account to continue your language journey.
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[#2A1616] border border-[#5C2B2B] text-[#E8A0A0] text-sm">
              {error.response?.data?.message || error.message}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-[#8A968E]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={loginData.email}
                onChange={handleChange}
                className="field-box"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[13px] font-medium text-[#8A968E]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={loginData.password}
                  onChange={handleChange}
                  className="field-box pr-11"
                  required
                  minLength={6}
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

            <div className="flex items-center justify-between -mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="check-box"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-[13px] text-[#8A968E]">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[13px] text-[#8FE388]">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="cta-btn w-full mt-1 h-12 rounded-full bg-[#8FE388] text-[#0B1410] font-semibold text-[15px] hover:bg-[#A6EC9E] disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <span className="divider-line" />
            <span className="text-[12px] text-[#4A5A50]">or</span>
            <span className="divider-line" />
          </div>

          <button
            type="button"
            className="google-btn w-full h-12 rounded-full border border-[#223229] text-[#F3F1EA] text-[14px] font-medium flex items-center justify-center gap-2.5"
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-[14px] text-[#8A968E]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#8FE388] font-medium">
              Create account
            </Link>
          </p>
        </div>

        {/* Right Side — the signature moment */}
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

          {/* orbit rings suggesting the "connecting globally" globe from the reference */}
          <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 125" preserveAspectRatio="none">
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
              Your table is
              <br />
              still open.
            </h2>
            <p className="text-[14px] text-[#8A968E] max-w-xs leading-relaxed">
              Partners you've spoken with are online now — jump back into the
              conversation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;