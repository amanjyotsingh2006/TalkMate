import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api.js";
import { LANGUAGES } from "../constants/index.js";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import { useThemeStore } from "../Store/useThemeStore.js";

const OnboardingPage = () => {
  const { theme } = useThemeStore();
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile Onboarded Successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRandomAvatar = () => {
    const randomAvatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${
      Math.floor(Math.random() * 100) + 1
    }.png`;

    setFormState((prev) => ({ ...prev, profilePic: randomAvatar }));
    toast.success("Avatar Changed Successfully");
  };

  const handleOnboarding = (e) => {
    e.preventDefault();
    onboardMutation(formState);
  };

  const avatar =
    formState.profilePic ||
    `https://api.dicebear.com/9.x/adventurer/svg?seed=${Math.floor(Math.random() * 1000)}`;

  return (
    <div data-theme={theme} className="onboarding-root min-h-screen w-full relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');

        .onboarding-root {
          background: #0B1410;
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

        .field-wrap { position: relative; }
        .field-icon {
          position: absolute;
          left: 0.1rem;
          bottom: 0.65rem;
          color: #4A5A50;
          pointer-events: none;
        }
        .field-underline {
          background: transparent;
          border: none;
          border-bottom: 1.5px solid #26362D;
          border-radius: 0;
          padding: 0.5rem 0;
          color: #F3F1EA;
          transition: border-color 0.2s ease;
          width: 100%;
        }
        .field-underline::placeholder { color: #4A5A50; }
        .field-underline:focus {
          outline: none;
          border-bottom-color: #8FE388;
        }
        .field-wrap:focus-within .field-icon { color: #8FE388; }

        select.field-underline {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%238A968E'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.2rem center;
          background-size: 1.1em;
        }
        select.field-underline option {
          background: #12201A;
          color: #F3F1EA;
        }

        .avatar-ring {
          position: relative;
          width: 128px;
          height: 128px;
          border-radius: 9999px;
          padding: 4px;
          background: conic-gradient(#8FE388, #26362D 65%, #8FE388);
        }
        .avatar-ring img {
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          object-fit: cover;
          background: #12201A;
          display: block;
        }

        .ghost-btn {
          border: 1.5px solid #26362D;
          color: #C7D0CA;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .ghost-btn:hover {
          border-color: #8FE388;
          color: #8FE388;
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

      <div className="relative z-10 min-h-screen w-full flex justify-center px-4 py-14">
        <div className="w-full max-w-[560px]">
          <div className="flex items-center gap-2 mb-10">
            <ShipWheelIcon className="size-7 text-[#8FE388]" />
            <span className="font-display text-2xl text-[#F3F1EA]">Streamify</span>
          </div>

          <p className="text-[13px] text-[#6F7D74] mb-3">One last step</p>
          <h1 className="font-display text-4xl leading-[1.08] text-[#F3F1EA] mb-4">
            Complete your profile
          </h1>
          <p className="text-[#8A968E] text-[15px] mb-10 max-w-md leading-relaxed">
            This is what language partners see first — a few honest details
            go a long way.
          </p>

          <div className="flex items-center gap-5 mb-12">
            <div className="avatar-ring">
              <img src={avatar} alt="Profile avatar" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-[#8A968E]">
                Not feeling this one?
              </span>
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="ghost-btn flex items-center gap-2 w-fit px-4 py-2 rounded-full text-[13px]"
              >
                <ShuffleIcon className="size-3.5" />
                Shuffle avatar
              </button>
            </div>
          </div>

          <form onSubmit={handleOnboarding} className="flex flex-col gap-8">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#8A968E]">Full name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="field-underline"
                value={formState.fullName}
                onChange={handleChange("fullName")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#8A968E]">Bio</label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell others about yourself and your language learning goals"
                rows={3}
                className="field-underline resize-none"
                value={formState.bio}
                onChange={handleChange("bio")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-[#8A968E]">Native language</label>
                <select
                  className="field-underline"
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={handleChange("nativeLanguage")}
                >
                  <option value="">Select language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-[#8A968E]">Learning language</label>
                <select
                  className="field-underline"
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={handleChange("learningLanguage")}
                >
                  <option value="">Select language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#8A968E]">Location</label>
              <div className="field-wrap">
                <MapPinIcon className="field-icon size-4" />
                <input
                  type="text"
                  placeholder="City, Country"
                  className="field-underline"
                  style={{ paddingLeft: "1.7rem" }}
                  value={formState.location}
                  onChange={handleChange("location")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="cta-btn mt-3 h-12 rounded-full bg-[#8FE388] text-[#0B1410] font-semibold text-[15px] hover:bg-[#A6EC9E] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5" />
                  Complete onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5" />
                  Setting things up…
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
