
import { LoaderCircleIcon, ShipWheelIcon } from "lucide-react";
import { useThemeStore } from "../Store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();

  return (
    <div
      data-theme={theme}
      role="status"
      aria-label="Loading"
      className="flex min-h-screen items-center justify-center bg-base-100"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <ShipWheelIcon className="size-8 animate-pulse text-primary" />
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-base-content/60">
          <LoaderCircleIcon className="size-4 animate-spin text-primary" />
          <span>Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;