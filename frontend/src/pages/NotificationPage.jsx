import { Link } from "react-router";
import { useThemeStore } from "../Store/useThemeStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";

import {
  BellIcon,
  ClockIcon,
  HomeIcon,
  MessageSquareIcon,
  ShipWheelIcon,
  UserCheckIcon,
  UserIcon,
  UsersRoundIcon,
} from "lucide-react";

import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationPage = () => {
  const { theme } = useThemeStore();
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  // NOTE: no decline endpoint exists in lib/api yet.
  const handleDecline = (requestId) => {
    console.warn("Decline not yet wired to an API call:", requestId);
  };

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];

  return (
    <div
      data-theme={theme}
      className="
        relative
        min-h-screen
        w-full
        bg-base-200
        text-base-content
        sm:pl-20
      "
    >
      {/* sm:pl-20 leaves room for the desktop sidebar; on mobile there is
          no sidebar, so content uses the full width */}
      <div
        className="
          relative z-10
          w-full
          max-w-5xl
          px-4
          py-6
          pb-24
          sm:px-6
          sm:py-10
          sm:pb-10
          lg:px-8
        "
      >
        {/* ================= HEADER ================= */}
        <p className="mb-1 text-[12px] text-base-content/50 sm:mb-2 sm:text-[13px]">
          Stay in the loop
        </p>

        <h1
          className="
            mb-6
            font-display
            text-2xl
            text-base-content
            sm:mb-9
            sm:text-4xl
          "
        >
          Notifications
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : (
          <>
            {/* ================= INCOMING FRIEND REQUESTS ================= */}
            {incomingRequests.length > 0 && (
              <section className="mb-8 space-y-3 sm:mb-10">
                <h2
                  className="
                    mb-1
                    flex items-center gap-2.5
                    text-[15px]
                    font-semibold
                    text-base-content/80
                  "
                >
                  <UserCheckIcon className="size-4.5 text-primary" />

                  Friend requests

                  <span
                    className="
                      inline-flex
                      min-w-[22px]
                      h-[22px]
                      items-center
                      justify-center
                      rounded-full
                      bg-primary
                      px-1.5
                      text-xs
                      font-semibold
                      text-primary-content
                    "
                  >
                    {incomingRequests.length}
                  </span>
                </h2>

                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="
                      rounded-2xl
                      border-l-4 border-l-primary
                      border-r border-t border-b border-base-300
                      bg-base-100
                      p-3
                      transition-all duration-200
                      hover:border-r-primary/30
                      hover:border-t-primary/30
                      hover:border-b-primary/30
                      sm:p-4
                    "
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="
                          shrink-0
                          rounded-full
                          bg-gradient-to-br
                          from-primary
                          to-base-300
                          p-0.5
                        "
                      >
                        <div className="size-10 overflow-hidden rounded-full bg-base-100 sm:size-11">
                          <img
                            src={request.sender.profilePic}
                            alt={request.sender.fullName}
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-[14px] leading-snug text-base-content">
                          <span className="font-semibold">
                            {request.sender.fullName}
                          </span>{" "}
                          sent you a friend request
                        </p>

                        <p className="mt-1 break-words text-[12px] text-base-content/50">
                          Native: {request.sender.nativeLanguage} · Learning:{" "}
                          {request.sender.learningLanguage}
                        </p>

                        {/* Time (mobile: under the text) */}
                        <p className="mt-1 text-[11px] text-base-content/40 sm:hidden">
                          Recently
                        </p>

                        {/* Actions: full-width halves on mobile */}
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                            className="
                              h-9
                              flex-1
                              rounded-full
                              bg-primary
                              px-4
                              text-[13px]
                              font-semibold
                              text-primary-content
                              transition-all duration-200
                              hover:bg-primary/90
                              active:scale-95
                              disabled:cursor-not-allowed
                              disabled:bg-base-300
                              disabled:text-base-content/40
                              sm:h-8
                              sm:flex-none
                            "
                          >
                            Accept
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDecline(request._id)}
                            className="
                              h-9
                              flex-1
                              rounded-full
                              border border-base-300
                              bg-base-100
                              px-4
                              text-[13px]
                              font-semibold
                              text-base-content/60
                              transition-all duration-200
                              hover:border-error/50
                              hover:bg-error/10
                              hover:text-error
                              active:scale-95
                              sm:h-8
                              sm:flex-none
                            "
                          >
                            Decline
                          </button>
                        </div>
                      </div>

                      {/* Time (desktop: right side) */}
                      <span
                        className="
                          hidden
                          shrink-0
                          text-[11px]
                          text-base-content/40
                          sm:block
                        "
                      >
                        Recently
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* ================= ACCEPTED REQUESTS ================= */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-3">
                <h2
                  className="
                    mb-1
                    flex items-center gap-2.5
                    text-[15px]
                    font-semibold
                    text-base-content/80
                  "
                >
                  <BellIcon className="size-4.5 text-primary" />

                  New connections
                </h2>

                {acceptedRequests.map((notification) => (
                  <div
                    key={notification._id}
                    className="
                      rounded-2xl
                      border border-base-300
                      bg-base-100
                      p-3
                      transition-all duration-200
                      hover:border-primary/30
                      sm:p-4
                      sm:hover:-translate-y-0.5
                      sm:hover:shadow-lg
                    "
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className="
                          shrink-0
                          rounded-full
                          bg-gradient-to-br
                          from-primary
                          to-base-300
                          p-0.5
                        "
                      >
                        <div className="size-10 overflow-hidden rounded-full bg-base-100 sm:size-11">
                          <img
                            src={notification.recipient.profilePic}
                            alt={notification.recipient.fullName}
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            break-words
                            text-[14px]
                            leading-snug
                            text-base-content
                          "
                        >
                          <span className="font-semibold">
                            {notification.recipient.fullName}
                          </span>{" "}
                          accepted your friend request
                        </p>

                        <p
                          className="
                            mt-1
                            flex items-center gap-1
                            text-[12px]
                            text-base-content/40
                          "
                        >
                          <ClockIcon className="size-3" />
                          Recently
                        </p>
                      </div>

                      {/* New Friend Badge: icon-only on mobile */}
                      <span
                        className="
                          flex shrink-0
                          items-center gap-1.5
                          rounded-full
                          border border-primary/20
                          bg-primary/10
                          p-2
                          text-[11px]
                          font-semibold
                          text-primary
                          sm:px-3
                          sm:py-1.5
                        "
                      >
                        <MessageSquareIcon className="size-3.5 sm:size-3" />
                        <span className="hidden sm:inline">New friend</span>
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* ================= EMPTY STATE ================= */}
            {incomingRequests.length === 0 &&
              acceptedRequests.length === 0 && <NoNotificationsFound />}
          </>
        )}
      </div>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
          Desktop: hidden
      ===================================================== */}
      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-base-300
          bg-base-100
          sm:hidden
        "
      >
        <div className="grid grid-cols-4 px-2 py-1.5">
          {/* HOME */}
          <Link
            to="/"
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              py-1.5
              text-base-content/60
              transition
              hover:text-primary
            "
          >
            <div className="flex size-8 items-center justify-center">
              <HomeIcon className="size-[18px]" />
            </div>
            <span className="text-[9px] font-medium">Home</span>
          </Link>

          {/* FRIENDS */}
          <Link
            to="/friends"
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              py-1.5
              text-base-content/60
              transition
              hover:text-primary
            "
          >
            <div className="flex size-8 items-center justify-center">
              <UsersRoundIcon className="size-[18px]" />
            </div>
            <span className="text-[9px] font-medium">Friends</span>
          </Link>

          {/* NOTIFICATIONS (active) */}
          <Link
            to="/notification"
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              py-1.5
              text-primary
            "
          >
            <div
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-lg
                bg-primary/10
              "
            >
              <BellIcon className="size-4" />
            </div>
            <span className="text-[9px] font-semibold">Notifications</span>
          </Link>

          {/* PROFILE */}
          <Link
            to="/profile"
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              py-1.5
              text-base-content/60
              transition
              hover:text-primary
            "
          >
            <div className="flex size-8 items-center justify-center">
              <UserIcon className="size-[18px]" />
            </div>
            <span className="text-[9px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default NotificationPage;