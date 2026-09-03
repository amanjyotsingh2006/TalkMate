import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersRoundIcon,
  SparklesIcon,
  SearchIcon,
  MessageCircleIcon,
} from "lucide-react";

import { useThemeStore } from "../Store/useThemeStore";
import {
  getOutgoingFriendReqs,
  getRecommendedUser,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";

import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";

const HomePage = () => {
  const { theme } = useThemeStore();
  const queryClient = useQueryClient();

  const [outgoingRequestIds, setOutgoingRequestIds] = useState(new Set());
  const [search, setSearch] = useState("");

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUser,
  });

  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["outgoingFriendReqs"],
      });
    },
  });

  useEffect(() => {
    setOutgoingRequestIds(
      new Set(outgoingFriendReqs.map((req) => req.recipient._id))
    );
  }, [outgoingFriendReqs]);

  const filteredFriends = friends.filter((f) =>
    f.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRecommended = recommendedUsers.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      data-theme={theme}
      className="min-h-screen w-full bg-base-200 text-base-content"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* ================= SEARCH ================= */}
        <div className="relative mb-9">
          <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-base-content/50" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search streams or users…"
            className="
              w-full rounded-full
              border border-base-300
              bg-base-100
              px-4 py-3 pl-11
              text-base-content
              placeholder:text-base-content/50
              outline-none
              transition-all duration-200
              focus:border-primary
              focus:ring-4
              focus:ring-primary/10
            "
          />
        </div>

        {/* ================= FRIENDS ================= */}
        <section className="mb-14">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <UsersRoundIcon className="size-4 text-primary" />

                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Your circle
                </p>
              </div>

              <h1 className="font-display text-3xl text-base-content sm:text-4xl">
                Your friends
              </h1>

              <p className="mt-2 text-sm text-base-content/70">
                Stay connected with people you've met along the way.
              </p>
            </div>

            <Link
              to="/notification"
              className="
                group inline-flex w-fit
                items-center gap-2
                rounded-xl
                border border-base-300
                bg-base-100
                px-4 py-2.5
                text-sm font-semibold
                text-base-content
                transition-all duration-200
                hover:border-primary/50
                hover:text-primary
              "
            >
              <UsersRoundIcon className="size-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Friend requests</span>
            </Link>
          </div>

          {/* ================= FRIENDS LOADING ================= */}
          {loadingFriends ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : filteredFriends.length === 0 ? (

            /* ================= NO FRIENDS ================= */
            <div
              className="
                rounded-[18px]
                border border-base-300
                bg-base-100
                p-10
                text-center
              "
            >
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <UsersRoundIcon className="size-7 text-primary/70" />
              </div>

              <h3 className="font-display text-lg text-base-content">
                No friends yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/70">
                Send a few requests below and your language partners will show
                up here.
              </p>
            </div>
          ) : (

            /* ================= FRIEND CARDS ================= */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredFriends.map((friend) => (
                <div
                  key={friend._id}
                  className="
        group
        flex
        flex-col
        rounded-[18px]
        border
        border-base-300
        bg-base-100
        p-5
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-primary/40
        hover:shadow-lg
      "
                >
                  {/* ================= PROFILE ================= */}
                  <div className="flex items-center gap-3">
                    {/* Profile Image */}
                    <div className="relative shrink-0">
                      <img
                        src={
                          friend.profilePic ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            friend.fullName || "User"
                          )}&background=random`
                        }
                        alt={friend.fullName}
                        loading="lazy"
                        className="
              size-14
              rounded-full
              object-cover
              ring-2
              ring-base-300
              transition-all
              duration-300
              group-hover:ring-primary/40
            "
                      />

                      {/* Online Status */}
                      <span
                        className={`
              absolute
              bottom-0
              right-0
              size-3.5
              rounded-full
              border-2
              border-base-100
              ${friend.isOnline
                            ? "bg-success"
                            : "bg-base-content/30"
                          }
            `}
                      />
                    </div>

                    {/* Name + Location */}
                    <div className="min-w-0">
                      <h3
                        className="
              truncate
              font-display
              text-base
              text-base-content
            "
                      >
                        {friend.fullName}
                      </h3>

                      {friend.location && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-base-content/60">
                          <MapPinIcon className="size-3" />

                          <span className="truncate">
                            {friend.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ================= DIVIDER ================= */}
                  <div className="my-4 h-px bg-base-300" />

                  {/* ================= LANGUAGES ================= */}
                  <div className="flex flex-wrap gap-2">
                    {/* Native */}
                    <span
                      className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-primary/20
            bg-primary/10
            px-3
            py-1.5
            text-xs
            font-semibold
            text-primary
          "
                    >
                      {getLanguageFlag(friend.nativeLanguage)}

                      <span>
                        Native · {capitialize(friend.nativeLanguage)}
                      </span>
                    </span>

                    {/* Learning */}
                    <span
                      className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-base-300
            bg-base-200
            px-3
            py-1.5
            text-xs
            font-semibold
            text-base-content/70
          "
                    >
                      {getLanguageFlag(friend.learningLanguage)}

                      <span>
                        Learning · {capitialize(friend.learningLanguage)}
                      </span>
                    </span>
                  </div>

                  {/* ================= BIO ================= */}
                  {friend.bio && (
                    <p
                      className="
            mt-4
            line-clamp-2
            text-sm
            leading-6
            text-base-content/70
          "
                    >
                      {friend.bio}
                    </p>
                  )}

                  {/* ================= MESSAGE ================= */}
                  <Link
                    to={`/chat/${friend._id}`}
                    className="
          mt-5
          flex
          h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-full
          bg-primary
          text-sm
          font-bold
          text-primary-content
          transition-all
          duration-200
          hover:bg-primary/90
          hover:shadow-lg
          hover:shadow-primary/20
        "
                  >
                    <MessageCircleIcon className="size-4" />
                    Message
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= RECOMMENDATIONS ================= */}
        <section>
          <div className="mb-6 flex items-end justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />

                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Suggested for you
                </p>
              </div>

              <h2 className="font-display text-3xl text-base-content sm:text-4xl">
                Meet new learners
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/70 sm:text-base">
                Discover people who match your native and target languages and
                start a conversation.
              </p>
            </div>

            <Link
              to="/friends"
              className="
                hidden
                text-sm font-semibold
                text-primary
                transition-colors
                hover:text-primary/80
                sm:block
              "
            >
              View all
            </Link>
          </div>

          {/* ================= RECOMMENDATIONS LOADING ================= */}
          {loadingUsers ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : filteredRecommended.length === 0 ? (

            /* ================= NO RECOMMENDATIONS ================= */
            <div
              className="
                rounded-[18px]
                border border-base-300
                bg-base-100
                p-10
                text-center
              "
            >
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <SparklesIcon className="size-7 text-primary/70" />
              </div>

              <h3 className="font-display text-lg text-base-content">
                No recommendations yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/70">
                We don't have any new language partners for you right now.
                Check back later for new people to connect with.
              </p>
            </div>
          ) : (

            /* ================= RECOMMENDATION CARDS ================= */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredRecommended.map((user) => {
                const hasRequestBeenSent = outgoingRequestIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="
                      group flex flex-col
                      rounded-[18px]
                      border border-base-300
                      bg-base-100
                      p-5
                      transition-all duration-200
                      hover:-translate-y-0.5
                      hover:border-primary/40
                      hover:shadow-lg
                    "
                  >
                    <div className="flex items-center gap-3">

                      <div className="relative shrink-0">
                        <img
                          src={
                            user.profilePic ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.fullName || "User"
                            )}&background=random`
                          }
                          alt={user.fullName}
                          loading="lazy"
                          className="
                            size-14 rounded-full
                            object-cover
                            ring-2 ring-base-300
                            transition-all duration-300
                            group-hover:ring-primary/40
                          "
                        />

                        <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-base-100 bg-success" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-display text-base text-base-content">
                          {user.fullName}
                        </h3>

                        {user.location && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-base-content/60">
                            <MapPinIcon className="size-3" />

                            <span className="truncate">
                              {user.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="my-4 h-px bg-base-300" />

                    <div className="flex flex-wrap gap-2">

                      <span
                        className="
                          inline-flex items-center gap-1.5
                          rounded-full
                          border border-primary/20
                          bg-primary/10
                          px-3 py-1.5
                          text-xs font-semibold
                          text-primary
                        "
                      >
                        {getLanguageFlag(user.nativeLanguage)}

                        <span>
                          Native · {capitialize(user.nativeLanguage)}
                        </span>
                      </span>

                      <span
                        className="
                          inline-flex items-center gap-1.5
                          rounded-full
                          border border-base-300
                          bg-base-200
                          px-3 py-1.5
                          text-xs font-semibold
                          text-base-content/70
                        "
                      >
                        {getLanguageFlag(user.learningLanguage)}

                        <span>
                          Learning · {capitialize(user.learningLanguage)}
                        </span>
                      </span>

                    </div>

                    {user.bio && (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-base-content/70">
                        {user.bio}
                      </p>
                    )}

                    {/* ================= SEND REQUEST ================= */}
                    <button
                      type="button"
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={hasRequestBeenSent || isPending}
                      className={`
                        mt-5 flex h-11 w-full
                        items-center justify-center gap-2
                        rounded-full
                        text-sm font-bold
                        transition-all duration-200

                        ${hasRequestBeenSent
                          ? "cursor-default border border-primary/25 bg-primary/10 text-primary"
                          : "bg-primary text-primary-content hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                        }
                      `}
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckCircleIcon className="size-4" />
                          Request sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-4" />
                          Send friend request
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div >
    </div >
  );
};

export default HomePage;