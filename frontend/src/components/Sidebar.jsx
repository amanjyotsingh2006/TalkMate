import {
  BellIcon,
  HomeIcon,
  ShipWheelIcon,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useThemeStore } from "../Store/useThemeStore";

const menuItems = [
  { name: "Home", path: "/", icon: HomeIcon },
  { name: "Friends", path: "/friends", icon: Users },
  { name: "Notifications", path: "/notification", icon: BellIcon },
];

const Sidebar = () => {
  const { theme } = useThemeStore();
  const { authUser } = useAuthUser();
  const { pathname } = useLocation();

  return (
    <aside
      data-theme={theme}
      className="
        fixed left-0 top-0 z-40
        hidden h-screen w-72
        border-r border-base-300
        bg-base-100
        text-base-content
        lg:block
      "
    >
      <div className="flex h-full flex-col">

        {/* ================= LOGO ================= */}
        <div className="border-b border-base-300 px-5 py-5">
          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div
              className="
                flex size-11 items-center justify-center
                rounded-xl
                bg-primary/10
                transition-all duration-300
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

            <div>
              <h1 className="font-display text-xl text-base-content">
                Streamify
              </h1>

              <p className="text-[11px] font-medium text-base-content/50">
                Connect • Talk • Share
              </p>
            </div>
          </Link>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="flex-1 px-4 py-6">
          <p
            className="
              mb-3 px-3
              text-xs font-semibold uppercase
              tracking-wider
              text-base-content/50
            "
          >
            Menu
          </p>

          <div className="space-y-2">
            {menuItems.map(({ name, path, icon: Icon }) => {
              const isActive =
                path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(path);

              return (
                <Link
                  key={name}
                  to={path}
                  className={`
                    group flex items-center gap-3
                    rounded-xl px-4 py-3
                    text-sm font-semibold
                    transition-all duration-200

                    ${
                      isActive
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    }
                  `}
                >
                  <Icon
                    className={`
                      size-5
                      transition-transform duration-200
                      ${
                        !isActive
                          ? "group-hover:scale-110"
                          : ""
                      }
                    `}
                  />

                  <span>{name}</span>

                  {isActive && (
                    <span
                      className="
                        ml-auto
                        size-1.5
                        rounded-full
                        bg-primary-content
                      "
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ================= USER PROFILE ================= */}
        <div className="border-t border-base-300 p-4">
          <Link
            to="/profile"
            className="
              group flex items-center gap-3
              rounded-2xl p-3
              transition-all duration-200
              hover:bg-base-200
            "
          >
            <div className="relative shrink-0">
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
                  size-12 rounded-xl
                  object-cover
                  ring-2 ring-base-300
                  transition-all duration-200
                  group-hover:ring-primary
                "
              />

              <span
                className="
                  absolute -bottom-0.5 -right-0.5
                  size-3.5
                  rounded-full
                  border-2 border-base-100
                  bg-success
                "
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold text-base-content">
                {authUser?.fullName || "User"}
              </h2>

              <div className="mt-0.5 flex items-center gap-1.5">

                <span className="text-xs font-medium text-success">
                  Online
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;