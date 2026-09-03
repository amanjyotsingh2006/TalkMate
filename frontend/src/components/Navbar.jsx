import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useThemeStore } from "../Store/useThemeStore";

const Navbar = () => {
  const { theme } = useThemeStore();
  const { authUser } = useAuthUser();
  const { pathname } = useLocation();
  const { logoutMutation } = useLogout();

  const isChatPage = pathname.startsWith("/chat");

  return (
    <nav
      data-theme={theme}
      className="
        flex h-[72px] items-center justify-between
        border-b border-base-300
        bg-base-100/95
        px-4 sm:px-6
        text-base-content
        backdrop-blur-md
      "
    >
      {/* ================= LOGO ================= */}
      <div className={isChatPage ? "flex" : "invisible"}>
        <Link
          to="/"
          className="
            group flex items-center gap-2
            transition-transform duration-200
            hover:scale-[1.02]
          "
        >
          <div
            className="
              flex size-10 items-center justify-center
              rounded-xl
              bg-primary/10
              transition-colors duration-200
              group-hover:bg-primary/20
            "
          >
            <ShipWheelIcon
              className="
                size-7
                text-primary
                transition-transform duration-300
                group-hover:rotate-12
              "
            />
          </div>

          <h1
            className="
              hidden
              font-display
              text-2xl
              text-base-content
              sm:block
            "
          >
            Streamify
          </h1>
        </Link>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Notifications */}
        <Link
          to="/notification"
          aria-label="Notifications"
          className="
            relative flex size-10
            items-center justify-center
            rounded-xl
            text-base-content/70
            transition-all duration-200
            hover:bg-base-200
            hover:text-base-content
            active:scale-95
          "
        >
          <BellIcon className="size-5" />
        </Link>

        {/* Theme Selector */}
        <div className="flex items-center justify-center">
          <ThemeSelector />
        </div>

        {/* Profile */}
        <Link
          to="/profile"
          className="group relative hidden sm:block"
          aria-label="Profile"
        >
          <img
            src={
              authUser?.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                authUser?.fullName || "User"
              )}&background=random`
            }
            alt={authUser?.fullName || "Profile"}
            loading="lazy"
            className="
              size-10 rounded-full
              border-2 border-base-300
              object-cover
              transition-all duration-200
              group-hover:border-primary
            "
          />

          <span
            className="
              absolute bottom-0 right-0
              size-3 rounded-full
              border-2 border-base-100
              bg-success
            "
          />
        </Link>

        {/* Logout */}
        <button
          type="button"
          onClick={logoutMutation}
          aria-label="Logout"
          className="
            flex size-10
            items-center justify-center
            rounded-xl
            text-base-content/70
            transition-all duration-200
            hover:bg-error/10
            hover:text-error
            active:scale-95
          "
        >
          <LogOutIcon className="size-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;