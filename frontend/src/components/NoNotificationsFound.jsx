import { BellIcon, SparklesIcon } from "lucide-react";

const NoNotificationsFound = () => {
  return (
    <div className="empty-root flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .empty-root { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="relative mb-6">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-[#8FE388]/10">
          <BellIcon className="size-9 text-[#8FE388]/70" />
        </div>
        <div className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border border-[#1D2C22] bg-[#0F1A14] shadow-sm">
          <SparklesIcon className="size-4 text-[#8FE388]" />
        </div>
      </div>

      <h3 className="font-display mb-2 text-xl text-[#F3F1EA]">You're all caught up!</h3>

      <p className="max-w-md text-sm leading-6 text-[#8A968E] sm:text-base">
        You don't have any notifications right now. Friend requests, messages, and other updates
        will appear here.
      </p>
    </div>
  );
};

export default NoNotificationsFound;