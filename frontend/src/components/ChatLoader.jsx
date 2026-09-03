import { LoaderIcon } from "lucide-react";

const ChatLoader = () => {
  return (
    <div
      className="flex h-screen flex-col items-center justify-center gap-4 p-4"
      style={{ background: "#0B1410", fontFamily: "'Inter', sans-serif" }}
      role="status"
      aria-label="Connecting to chat"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500&display=swap');
        .loader-ring {
          animation: spin 1s linear infinite;
          color: #8FE388;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <LoaderIcon className="loader-ring size-9" />
      <p
        className="text-[15px]"
        style={{ fontFamily: "'Fraunces', serif", color: "#F3F1EA" }}
      >
        Connecting to chat…
      </p>
    </div>
  );
};

export default ChatLoader;