
import { useQuery } from "@tanstack/react-query";
import {
  MessageSquareIcon,
  VideoIcon,
  PencilIcon,
  MapPinIcon,
} from "lucide-react";

import { useThemeStore } from "../Store/useThemeStore";
import useAuthUser from "../hooks/useAuthUser";
import { getUserFriends } from "../lib/api";
import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";

const ProfilePage = () => {
  const { theme } = useThemeStore();
  const { authUser } = useAuthUser();

  // Real count — the only stat we actually have data for.
  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div
      data-theme={theme}
      className="
        min-h-screen
        w-full
        bg-base-200
        text-base-content
      "
    >
      <div className="w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">

          {/* Profile Image */}
          <img
            src={
              authUser?.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                authUser?.fullName || "User"
              )}&background=random`
            }
            alt={authUser?.fullName || "Profile"}
            className="
              size-28
              shrink-0
              rounded-full
              object-cover
              ring-4 ring-base-100
            "
          />

          <div className="min-w-0 flex-1">

            {/* Name */}
            <h1
              className="
                font-display
                text-2xl
                text-base-content
                sm:text-3xl
              "
            >
              {authUser?.fullName || "Your profile"}
            </h1>

            {/* Location */}
            {authUser?.location && (
              <p
                className="
                  mt-1
                  flex items-center
                  justify-center gap-1.5
                  text-sm
                  text-base-content/60
                  sm:justify-start
                "
              >
                <MapPinIcon className="size-3.5" />
                {authUser.location}
              </p>
            )}

            {/* Bio */}
            {authUser?.bio && (
              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-base-content/60
                "
              >
                {authUser.bio}
              </p>
            )}

            {/* Actions */}
            <div
              className="
                mt-5
                flex flex-wrap
                justify-center
                gap-2.5
                sm:justify-start
              "
            >
              {/* Message */}
              <button
                type="button"
                className="
                  flex items-center gap-2
                  rounded-full
                  bg-primary
                  px-5 py-2.5
                  text-sm font-semibold
                  text-primary-content
                  transition-all duration-200
                  hover:bg-primary/90
                  active:scale-[0.98]
                "
              >
                <MessageSquareIcon className="size-4" />
                Message
              </button>

              {/* Video Call */}
              <button
                type="button"
                className="
                  flex items-center gap-2
                  rounded-full
                  border border-base-300
                  bg-base-100
                  px-5 py-2.5
                  text-sm font-semibold
                  text-base-content
                  transition-all duration-200
                  hover:border-primary
                  hover:text-primary
                  active:scale-[0.98]
                "
              >
                <VideoIcon className="size-4" />
                Video call
              </button>

              {/* Edit Profile */}
              <button
                type="button"
                className="
                  flex items-center gap-1.5
                  rounded-full
                  px-4 py-2.5
                  text-sm font-semibold
                  text-primary
                  transition-all duration-200
                  hover:bg-primary/10
                  hover:text-primary
                "
              >
                <PencilIcon className="size-3.5" />
                Edit profile
              </button>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Friends */}
          <div
            className="
              rounded-2xl
              border border-base-300
              bg-base-100
              p-5
              text-center
            "
          >
            <p className="font-display text-3xl text-primary">
              {friends.length}
            </p>

            <p
              className="
                mt-1
                text-xs font-medium
                uppercase tracking-wider
                text-base-content/50
              "
            >
              Friends
            </p>
          </div>

          {/* Conversations */}
          <div
            className="
              rounded-2xl
              border border-base-300
              bg-base-100
              p-5
              text-center
            "
          >
            <p className="font-display text-3xl text-base-content/30">
              —
            </p>

            <p
              className="
                mt-1
                text-xs font-medium
                uppercase tracking-wider
                text-base-content/50
              "
            >
              Conversations
            </p>
          </div>

          {/* Practice Hours */}
          <div
            className="
              rounded-2xl
              border border-base-300
              bg-base-100
              p-5
              text-center
            "
          >
            <p className="font-display text-3xl text-base-content/30">
              —
            </p>

            <p
              className="
                mt-1
                text-xs font-medium
                uppercase tracking-wider
                text-base-content/50
              "
            >
              Practice hours
            </p>
          </div>
        </div>

        {/* ================= LANGUAGES ================= */}
        {(authUser?.nativeLanguage || authUser?.learningLanguage) && (
          <div
            className="
              mt-8
              rounded-[18px]
              border border-base-300
              bg-base-100
              p-6
            "
          >
            <h2
              className="
                mb-4
                font-display
                text-lg
                text-base-content
              "
            >
              Languages
            </h2>

            <div className="space-y-2.5">

              {/* Native Language */}
              {authUser?.nativeLanguage && (
                <div
                  className="
                    flex items-center
                    justify-between
                    rounded-xl
                    border border-base-300
                    bg-base-200
                    px-4 py-3
                  "
                >
                  <div className="flex items-center gap-2.5">
                    {getLanguageFlag(authUser.nativeLanguage)}

                    <span className="text-sm font-medium text-base-content">
                      {capitialize(authUser.nativeLanguage)}
                    </span>
                  </div>

                  <span
                    className="
                      rounded-full
                      border border-primary/20
                      bg-primary/10
                      px-2.5 py-0.5
                      text-[11px]
                      font-semibold
                      text-primary
                    "
                  >
                    Native
                  </span>
                </div>
              )}

              {/* Learning Language */}
              {authUser?.learningLanguage && (
                <div
                  className="
                    flex items-center
                    justify-between
                    rounded-xl
                    border border-base-300
                    bg-base-200
                    px-4 py-3
                  "
                >
                  <div className="flex items-center gap-2.5">
                    {getLanguageFlag(authUser.learningLanguage)}

                    <span className="text-sm font-medium text-base-content">
                      {capitialize(authUser.learningLanguage)}
                    </span>
                  </div>

                  <span
                    className="
                      rounded-full
                      border border-base-300
                      bg-base-100
                      px-2.5 py-0.5
                      text-[11px]
                      font-semibold
                      text-base-content/70
                    "
                  >
                    Learning
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ABOUT / INTERESTS ================= */}
        {/* 
          About-me and Interests can be added once those fields
          are available from the API.
        */}

      </div>
    </div>
  );
};

export default ProfilePage;