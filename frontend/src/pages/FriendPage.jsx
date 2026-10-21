import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  SearchIcon,
  MessageSquareIcon,
  ChevronDownIcon,
  CheckIcon,
  XIcon,
  UsersRoundIcon,
  HomeIcon,
  BellIcon,
  UserIcon,
} from "lucide-react";

import { useThemeStore } from "../Store/useThemeStore";
import {
  getUserFriends,
  getFriendRequests,
  acceptFriendRequest,
} from "../lib/api";
import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";

const FriendsPage = () => {
  const { theme } = useThemeStore();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: friendRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending: accepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingRequests || [];

  const languageOptions = useMemo(() => {
    const set = new Set();

    friends.forEach((f) => {
      if (f.nativeLanguage) set.add(f.nativeLanguage);
      if (f.learningLanguage) set.add(f.learningLanguage);
    });

    return Array.from(set);
  }, [friends]);

  const filteredFriends = friends.filter((f) => {
    const matchesSearch =
      f.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      f.nativeLanguage?.toLowerCase().includes(search.toLowerCase()) ||
      f.learningLanguage?.toLowerCase().includes(search.toLowerCase());

    const matchesLanguage =
      languageFilter === "all" ||
      f.nativeLanguage === languageFilter ||
      f.learningLanguage === languageFilter;

    const matchesOnline = !onlineOnly || f.isOnline;

    return matchesSearch && matchesLanguage && matchesOnline;
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
      {/* pb-24 on mobile keeps content clear of the fixed bottom nav */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 sm:pb-10 lg:px-8 lg:py-10">
        {/* ================= HEADER ================= */}
        <h1
          className="
            mb-1
            font-display
            text-2xl
            text-base-content
            sm:mb-2
            sm:text-4xl
          "
        >
          Your friends
        </h1>

        <p className="mb-6 text-sm text-base-content/60 sm:mb-8">
          People you're learning and speaking with.
        </p>

        {/* ================= TABS ================= */}
        <div className="mb-5 flex gap-6 border-b border-base-300 sm:mb-6">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`
              border-b-2
              pb-3
              text-sm font-semibold
              transition-all duration-200
              ${
                tab === "all"
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/50 hover:text-base-content"
              }
            `}
          >
            All friends
          </button>

          <button
            type="button"
            onClick={() => setTab("requests")}
            className={`
              flex items-center gap-2
              border-b-2
              pb-3
              text-sm font-semibold
              transition-all duration-200
              ${
                tab === "requests"
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/50 hover:text-base-content"
              }
            `}
          >
            Requests

            {incomingRequests.length > 0 && (
              <span className="size-1.5 rounded-full bg-primary" />
            )}
          </button>
        </div>

        {tab === "all" ? (
          <>
            {/* ================= SEARCH + FILTERS ================= */}
            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <SearchIcon
                  className="
                    absolute left-4 top-1/2
                    size-4
                    -translate-y-1/2
                    text-base-content/40
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or language…"
                  className="
                    w-full
                    rounded-full
                    border border-base-300
                    bg-base-100
                    px-4 py-2.5 pl-11
                    text-base-content
                    placeholder:text-base-content/40
                    outline-none
                    transition-all duration-200
                    focus:border-primary
                    focus:ring-4
                    focus:ring-primary/10
                  "
                />
              </div>

              {/* Mobile: filter on left, toggle on right, same line */}
              <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-start">
                {/* Language Filter */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterOpen((o) => !o)}
                    className="
                      flex items-center gap-2
                      rounded-full
                      border border-base-300
                      bg-base-100
                      px-4 py-2.5
                      text-sm font-medium
                      text-base-content/80
                      transition-all duration-200
                      hover:border-primary/50
                      hover:text-base-content
                    "
                  >
                    {languageFilter === "all"
                      ? "All languages"
                      : capitialize(languageFilter)}

                    <ChevronDownIcon className="size-3.5" />
                  </button>

                  {filterOpen && (
                    <div
                      className="
                        absolute left-0 z-20 mt-2
                        max-h-64 w-48
                        overflow-y-auto
                        rounded-xl
                        border border-base-300
                        bg-base-100
                        p-1.5
                        shadow-xl
                        sm:left-auto sm:right-0
                      "
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setLanguageFilter("all");
                          setFilterOpen(false);
                        }}
                        className={`
                          w-full
                          rounded-lg
                          px-3 py-2
                          text-left text-sm
                          transition-colors duration-150
                          ${
                            languageFilter === "all"
                              ? "bg-primary/10 text-primary"
                              : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                          }
                        `}
                      >
                        All languages
                      </button>

                      {languageOptions.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            setLanguageFilter(lang);
                            setFilterOpen(false);
                          }}
                          className={`
                            w-full
                            rounded-lg
                            px-3 py-2
                            text-left text-sm
                            transition-colors duration-150
                            ${
                              languageFilter === lang
                                ? "bg-primary/10 text-primary"
                                : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                            }
                          `}
                        >
                          {capitialize(lang)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Online Toggle */}
                <label className="flex cursor-pointer select-none items-center gap-2.5">
                  <span className="whitespace-nowrap text-sm text-base-content/60">
                    Online only
                  </span>

                  <button
                    type="button"
                    onClick={() => setOnlineOnly((o) => !o)}
                    className={`
                      relative
                      h-[22px] w-10
                      shrink-0
                      rounded-full
                      transition-colors duration-200
                      ${onlineOnly ? "bg-primary" : "bg-base-300"}
                    `}
                    aria-pressed={onlineOnly}
                    aria-label="Show online friends only"
                  >
                    <span
                      className={`
                        absolute left-0.5 top-0.5
                        size-[18px]
                        rounded-full
                        bg-base-100
                        shadow-sm
                        transition-transform duration-200
                        ${onlineOnly ? "translate-x-[18px]" : "translate-x-0"}
                      `}
                    />
                  </button>
                </label>
              </div>
            </div>

            {/* ================= FRIENDS GRID ================= */}
            {loadingFriends ? (
              <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg text-primary" />
              </div>
            ) : filteredFriends.length === 0 ? (
              <div
                className="
                  rounded-[18px]
                  border border-base-300
                  bg-base-100
                  p-8
                  text-center
                  sm:p-10
                "
              >
                <div
                  className="
                    mx-auto mb-4
                    flex size-14
                    items-center justify-center
                    rounded-2xl
                    bg-primary/10
                  "
                >
                  <UsersRoundIcon className="size-7 text-primary/70" />
                </div>

                <h3 className="font-display text-lg text-base-content">
                  No friends found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend._id}
                    className="
                      flex flex-col
                      rounded-[18px]
                      border border-base-300
                      bg-base-100
                      p-4
                      transition-all duration-200
                      hover:border-primary/40
                      sm:p-5
                      sm:hover:-translate-y-0.5
                      sm:hover:shadow-lg
                    "
                  >
                    {/* Friend Header */}
                    <div className="flex items-center gap-3">
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
                            size-12
                            rounded-full
                            object-cover
                            ring-2 ring-base-300
                            sm:size-14
                          "
                        />

                        <span
                          className={`
                            absolute bottom-0 right-0
                            size-3.5
                            rounded-full
                            border-2 border-base-100
                            ${
                              friend.isOnline
                                ? "bg-success"
                                : "bg-base-content/30"
                            }
                          `}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-display text-base text-base-content">
                          {friend.fullName}
                        </h3>

                        {friend.bio && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-base-content/50">
                            {friend.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className="
                          inline-flex items-center gap-1.5
                          rounded-full
                          border border-primary/20
                          bg-primary/10
                          px-3 py-1
                          text-xs font-semibold
                          text-primary
                        "
                      >
                        {getLanguageFlag(friend.nativeLanguage)}
                        {capitialize(friend.nativeLanguage)}
                      </span>

                      <span
                        className="
                          inline-flex items-center gap-1.5
                          rounded-full
                          border border-base-300
                          bg-base-200
                          px-3 py-1
                          text-xs font-semibold
                          text-base-content/70
                        "
                      >
                        {getLanguageFlag(friend.learningLanguage)}
                        {capitialize(friend.learningLanguage)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2 sm:mt-5">
                      <Link
                        to={`/chat/${friend._id}`}
                        className="
                          flex h-10 flex-1
                          items-center justify-center gap-1.5
                          rounded-lg
                          border border-base-300
                          bg-base-200
                          text-sm font-semibold
                          text-base-content/80
                          transition-all duration-200
                          hover:border-primary
                          hover:text-primary
                        "
                      >
                        <MessageSquareIcon className="size-4" />
                        Message
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* ================= REQUESTS TAB ================= */
          <div className="max-w-2xl">
            {loadingRequests ? (
              <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg text-primary" />
              </div>
            ) : incomingRequests.length === 0 ? (
              <div
                className="
                  rounded-[18px]
                  border border-base-300
                  bg-base-100
                  p-8
                  text-center
                  sm:p-10
                "
              >
                <h3 className="font-display text-lg text-base-content">
                  No pending requests
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
                  New friend requests will show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="
                      rounded-[18px]
                      border border-base-300
                      bg-base-100
                      p-3
                      transition-all duration-200
                      hover:border-primary/30
                      sm:p-4
                    "
                  >
                    <div className="flex items-center gap-3">
                      {/* Request Sender Image */}
                      <img
                        src={
                          request.sender.profilePic ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            request.sender.fullName
                          )}&background=random`
                        }
                        alt={request.sender.fullName}
                        className="
                          size-11
                          shrink-0
                          rounded-full
                          object-cover
                          ring-2 ring-base-300
                          sm:size-12
                        "
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-display text-[15px] text-base-content">
                          {request.sender.fullName}
                        </h3>

                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <span
                            className="
                              rounded-full
                              border border-primary/20
                              bg-primary/10
                              px-2 py-0.5
                              text-[10px]
                              font-semibold
                              text-primary
                            "
                          >
                            {capitialize(request.sender.nativeLanguage)}
                          </span>

                          <span
                            className="
                              rounded-full
                              border border-base-300
                              bg-base-200
                              px-2 py-0.5
                              text-[10px]
                              font-semibold
                              text-base-content/70
                            "
                          >
                            {capitialize(request.sender.learningLanguage)}
                          </span>
                        </div>
                      </div>

                      {/* Request Actions */}
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => acceptRequestMutation(request._id)}
                          disabled={accepting}
                          className="
                            flex size-9
                            items-center justify-center
                            rounded-full
                            bg-primary
                            text-primary-content
                            transition-all duration-200
                            hover:bg-primary/90
                            active:scale-95
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                          aria-label="Accept request"
                        >
                          <CheckIcon className="size-4" />
                        </button>

                        <button
                          type="button"
                          className="
                            flex size-9
                            items-center justify-center
                            rounded-full
                            border border-base-300
                            bg-base-100
                            text-base-content/60
                            transition-all duration-200
                            hover:border-error/50
                            hover:bg-error/10
                            hover:text-error
                            active:scale-95
                          "
                          aria-label="Decline request"
                        >
                          <XIcon className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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

          {/* FRIENDS (active) */}
          <Link
            to="/friends"
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-primary"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <UsersRoundIcon className="size-4" />
            </div>
            <span className="text-[9px] font-semibold">Friends</span>
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

          {/* PROFILE */}
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-base-content/60 transition hover:text-primary"
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

export default FriendsPage;