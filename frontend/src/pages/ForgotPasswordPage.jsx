import { useState } from "react";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, MailCheck } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "../components/AuthLayout";
import { forgotPassword } from "../lib/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const { mutate, isPending, error } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => setSent(true),
    onError: (err) =>
      toast.error(err.response?.data?.message || "Something went wrong"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(email);
  };

  return (
    <AuthLayout
      panelTitle={<>Never lose<br />your rhythm.</>}
      panelText="Your language partners, conversational audio notes, and daily practice streaks are preserved. Get back into your conversations in minutes."
    >
      <p className="text-[13px] text-[#6F7D74] mb-3 tracking-wide uppercase">
        Account recovery
      </p>

      {sent ? (
        <>
          <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-[#8FE388]/15 text-[#8FE388]">
            <MailCheck className="size-6" />
          </div>

          <h1 className="font-display text-4xl md:text-[3rem] leading-[1.08] text-[#F3F1EA] mb-4">
            Check your inbox
          </h1>
          <p className="text-[#8A968E] text-[15px] mb-9 max-w-sm leading-relaxed">
            If an account exists for{" "}
            <span className="text-[#F3F1EA] font-medium break-all">{email}</span>,
            we've sent a secure link to reset your password. It expires in 15
            minutes.
          </p>

          <Link
            to="/login"
            className="cta-btn flex items-center justify-center w-full h-12 rounded-full bg-[#8FE388] text-[#0B1410] font-semibold text-[15px] hover:bg-[#A6EC9E]"
          >
            Back to sign in
          </Link>

          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-5 w-full text-center text-[13px] text-[#8A968E] hover:text-[#F3F1EA]"
          >
            Didn't get it? Try again
          </button>
        </>
      ) : (
        <>
          <h1 className="font-display text-4xl md:text-[3rem] leading-[1.08] text-[#F3F1EA] mb-4">
            Forgot your password?
          </h1>
          <p className="text-[#8A968E] text-[15px] mb-9 max-w-sm leading-relaxed">
            Enter your email address and we will send you a secure link to reset
            your account credentials.
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[#2A1616] border border-[#5C2B2B] text-[#E8A0A0] text-sm">
              {error.response?.data?.message || error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-[#8A968E]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-box"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="cta-btn w-full mt-1 h-12 rounded-full bg-[#8FE388] text-[#0B1410] font-semibold text-[15px] hover:bg-[#A6EC9E] disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-xs"></span>
                  Sending…
                </span>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <span className="divider-line" />
            <span className="text-[12px] text-[#4A5A50]">or</span>
            <span className="divider-line" />
          </div>

          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[14px] text-[#8A968E]">
            <ArrowLeft className="size-4" />
            Remembered your password?
            <Link to="/login" className="text-[#8FE388] font-medium">
              Back to sign in
            </Link>
          </p>

          <p className="mt-8 text-[13px] text-[#6F7D74]">
            Having trouble accessing your inbox?{" "}
            <a
              href="mailto:support@streamify.com"
              className="underline hover:text-[#F3F1EA]"
            >
              Contact Support
            </a>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;