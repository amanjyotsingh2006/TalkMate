
import { useThemeStore } from "../Store/useThemeStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";

import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
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
      "
    >
      <div
        className="
          relative z-10
          ml-20
          w-full
          max-w-5xl
          px-4
          py-8
          sm:px-6
          sm:py-10
          lg:px-8
        "
      >
        {/* ================= HEADER ================= */}
        <p className="mb-2 text-[13px] text-base-content/50">
          Stay in the loop
        </p>

        <h1
          className="
            mb-9
            font-display
            text-3xl
            text-base-content
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
              <section className="mb-10 space-y-3">
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
                      p-4
                      transition-all duration-200
                      hover:border-r-primary/30
                      hover:border-t-primary/30
                      hover:border-b-primary/30
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
                        <div className="size-11 overflow-hidden rounded-full bg-base-100">
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
                        <p className="text-[14px] leading-snug text-base-content">
                          <span className="font-semibold">
                            {request.sender.fullName}
                          </span>{" "}
                          sent you a friend request
                        </p>

                        <p className="mt-1 text-[12px] text-base-content/50">
                          Native: {request.sender.nativeLanguage} · Learning:{" "}
                          {request.sender.learningLanguage}
                        </p>

                        {/* Actions */}
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              acceptRequestMutation(request._id)
                            }
                            disabled={isPending}
                            className="
                              h-8
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
                            "
                          >
                            Accept
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDecline(request._id)}
                            className="
                              h-8
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
                            "
                          >
                            Decline
                          </button>
                        </div>
                      </div>

                      {/* Time */}
                      <span
                        className="
                          shrink-0
                          text-[11px]
                          text-base-content/40
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
                      p-4
                      transition-all duration-200
                      hover:-translate-y-0.5
                      hover:border-primary/30
                      hover:shadow-lg
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
                        <div className="size-11 overflow-hidden rounded-full bg-base-100">
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

                      {/* New Friend Badge */}
                      <span
                        className="
                          flex shrink-0
                          items-center gap-1.5
                          rounded-full
                          border border-primary/20
                          bg-primary/10
                          px-3 py-1.5
                          text-[11px]
                          font-semibold
                          text-primary
                        "
                      >
                        <MessageSquareIcon className="size-3" />
                        New friend
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* ================= EMPTY STATE ================= */}
            {incomingRequests.length === 0 &&
              acceptedRequests.length === 0 && (
                <NoNotificationsFound />
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
