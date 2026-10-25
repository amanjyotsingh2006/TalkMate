import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "../components/AuthLayout";
import { resetPassword } from "../lib/api";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset! Please sign in.");
      navigate("/login", { replace: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (password.length < 6) {
      return setLocalError("Password must be at least 6 characters");
    }
    if (password !== confirm) {
      return setLocalError("Passwords don't match");
    }

    mutate({ token, password });
  };

  const errorMessage =
    localError || error?.response?.data?.message || error?.message;

  const linkExpired = error?.response?.status === 400;

  return (
    <AuthLayout
      panelTitle={<>A fresh start,<br />same conversations.</>}
      panelText="Choose a strong new password and you're right back to your partners, your streaks and your practice."
    >
      <p className="text-[13px] text-[#6F7D74] mb-3 tracking-wide uppercase">
        Account recovery
      </p>
      <h1 className="font-display text-4xl md:text-[3rem] leading-[1.08] text-[#F3F1EA] mb-4">
        Set a new password
      </h1>
      <p className="text-[#8A968E] text-[15px] mb-9 max-w-sm leading-relaxed">
        Your new password must be at least 6 characters long.
      </p>

      {errorMessage && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-[#2A1616] border border-[#5C2B2B] text-[#E8A0A0] text-sm">
          {errorMessage}
          {linkExpired && (
            <>
              {" "}
              <Link to="/forgot-password" className="underline text-[#F3F1EA]">
                Request a new link
              </Link>
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[13px] font-medium text-[#8A968E]">
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm" className="text-[13px] font-medium text-[#8A968E]">
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="field-box pr-11"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="eye-btn absolute right-3.5 top-1/2 -translate-y-1/2"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="cta-btn w-full mt-1 h-12 rounded-full bg-[#8FE388] text-[#0B1410] font-semibold text-[15px] hover:bg-[#A6EC9E] disabled:opacity-60"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="loading loading-spinner loading-xs"></span>
              Resetting…
            </span>
          ) : (
            "Reset password"
          )}
        </button>
      </form>

      <p className="mt-8 text-[14px] text-[#8A968E]">
        Changed your mind?{" "}
        <Link to="/login" className="text-[#8FE388] font-medium">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPasswordPage;