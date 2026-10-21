import { useQuery } from "@tanstack/react-query";
import { getProfileStats } from "../lib/api.js";
import {
  MessageSquareIcon,
  VideoIcon,
  PencilIcon,
  MapPinIcon,
  HomeIcon,
  UsersRoundIcon,
  BellIcon,
  UserIcon,
} from "lucide-react";

import { useThemeStore } from "../Store/useThemeStore";
import useAuthUser from "../hooks/useAuthUser";
import { getUserFriends } from "../lib/api.js";
import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";
import { Link } from "react-router";

const ProfilePage = () => {
  const { theme } = useThemeStore();
  const { authUser } = useAuthUser();

  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: stats } = useQuery({
    queryKey: ["profileStats"],
    queryFn: getProfileStats,
    refetchOnMount: "always",
  });

  const totalMinutes = Math.floor((stats?.practiceSeconds || 0) / 60);
  const practiceLabel =
    totalMinutes < 60
      ? `${totalMinutes}m`
      : `${(totalMinutes / 60).toFixed(1)}h`;

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
      {/* pb-24 on mobile keeps content clear of the fixed bottom nav */}
      <div className="w-full max-w-4xl px-4 py-6 pb-24 sm:px-6 sm:pb-10 lg:px-8 lg:py-10">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
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
              size-24
              shrink-0
              rounded-full
              object-cover
              ring-4 ring-base-100
              sm:size-28
            "
          />

          <div className="min-w-0 w-full flex-1">
            {/* Name */}
            <h1
              className="
                break-words
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
                <MapPinIcon className="size-3.5 shrink-0" />
                <span className="break-words">{authUser.location}</span>
              </p>
            )}

            {/* Bio */}
            {authUser?.bio && (
              <p
                className="
                  mt-3
                  max-w-xl
                  break-words
                  text-sm
                  leading-relaxed
                  text-base-content/60
                "
              >
                {authUser.bio}
              </p>
            )}

            {/* Actions: Message + Video call share a row on mobile,
                Edit profile goes full width below */}
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
              {/* <button
                type="button"
                className="
                  flex flex-1 items-center justify-center gap-2
                  rounded-full
                  bg-primary
                  px-5 py-2.5
                  text-sm font-semibold
                  text-primary-content
                  transition-all duration-200
                  hover:bg-primary/90
                  active:scale-[0.98]
                  sm:flex-none
                "
              >
                <MessageSquareIcon className="size-4" />
                Message
              </button> */}

              {/* Video Call */}
              {/* <button
                type="button"
                className="
                  flex flex-1 items-center justify-center gap-2
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
                  sm:flex-none
                "
              >
                <VideoIcon className="size-4" />
                Video call
              </button> */}

              {/* Edit Profile */}
              <Link
                to="/profile/edit"
                className="
                  flex w-full items-center justify-center gap-1.5
                  rounded-full
                  border border-primary/20
                  px-4 py-2.5
                  text-sm font-semibold
                  text-primary
                  transition-all duration-200
                  hover:bg-primary/10
                  hover:text-primary
                  sm:w-auto
                  sm:border-transparent
                "
              >
                <PencilIcon className="size-3.5" />
                Edit profile
              </Link>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}
        {/* 3 compact columns on mobile instead of 3 tall stacked cards */}
        <div className="mt-7 grid grid-cols-3 gap-2.5 sm:mt-9 sm:gap-4">
          {/* Friends */}
          <div
            className="
              rounded-2xl
              border border-base-300
              bg-base-100
              p-3
              text-center
              sm:p-5
            "
          >
            <p className="font-display text-2xl text-primary sm:text-3xl">
              {friends.length}
            </p>

            <p
              className="
                mt-1
                text-[10px] font-medium
                uppercase tracking-wider
                text-base-content/50
                sm:text-xs
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
              p-3
              text-center
              sm:p-5
            "
          >
            <p className="font-display text-2xl text-primary sm:text-3xl">
              {stats?.conversations ?? 0}
            </p>

            <p
              className="
                mt-1
                text-[10px] font-medium
                uppercase tracking-wider
                text-base-content/50
                sm:text-xs
              "
            >
              Chats
            </p>
          </div>

          {/* Practice Hours */}
          <div
            className="
              rounded-2xl
              border border-base-300
              bg-base-100
              p-3
              text-center
              sm:p-5
            "
          >
            <p className="font-display text-2xl text-primary sm:text-3xl">
              {practiceLabel}
            </p>

            <p
              className="
                mt-1
                text-[10px] font-medium
                uppercase tracking-wider
                text-base-content/50
                sm:text-xs
              "
            >
              Hours
            </p>
          </div>
        </div>

        {/* ================= LANGUAGES ================= */}
        {(authUser?.nativeLanguage || authUser?.learningLanguage) && (
          <div
            className="
              mt-6
              rounded-[18px]
              border border-base-300
              bg-base-100
              p-4
              sm:mt-8
              sm:p-6
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
                    justify-between gap-3
                    rounded-xl
                    border border-base-300
                    bg-base-200
                    px-3 py-3
                    sm:px-4
                  "
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    {getLanguageFlag(authUser.nativeLanguage)}

                    <span className="truncate text-sm font-medium text-base-content">
                      {capitialize(authUser.nativeLanguage)}
                    </span>
                  </div>

                  <span
                    className="
                      shrink-0
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
                    justify-between gap-3
                    rounded-xl
                    border border-base-300
                    bg-base-200
                    px-3 py-3
                    sm:px-4
                  "
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    {getLanguageFlag(authUser.learningLanguage)}

                    <span className="truncate text-sm font-medium text-base-content">
                      {capitialize(authUser.learningLanguage)}
                    </span>
                  </div>

                  <span
                    className="
                      shrink-0
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

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
          Desktop: hidden
      ===================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-base-300 bg-base-100 sm:hidden">
        <div className="grid grid-cols-4 px-2 py-1.5">
          {/* HOME */}
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-base-content/60 transition hover:text-primary"
          >
            <div className="flex size-8 items-center justify-center">
              <HomeIcon className="size-[18px]" />
            </div>
            <span className="text-[9px] font-medium">Home</span>
          </Link>

          {/* FRIENDS */}
          <Link
            to="/friends"
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-base-content/60 transition hover:text-primary"
          >
            <div className="flex size-8 items-center justify-center">
              <UsersRoundIcon className="size-[18px]" />
            </div>
            <span className="text-[9px] font-medium">Friends</span>
          </Link>

          {/* NOTIFICATIONS */}
          <Link
            to="/notification"
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-base-content/60 transition hover:text-primary"
          >
            <div className="flex size-8 items-center justify-center">
              <BellIcon className="size-[18px]" />
            </div>
            <span className="text-[9px] font-medium">Notifications</span>
          </Link>

          {/* PROFILE (active) */}
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-primary"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <UserIcon className="size-4" />
            </div>
            <span className="text-[9px] font-semibold">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default ProfilePage;