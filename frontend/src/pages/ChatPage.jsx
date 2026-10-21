import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";
import { ArrowLeft, Download, FileText, X } from "lucide-react";

import {
  Chat,
  Channel,
  MessageComposer,
  MessageList,
  Window,
  Attachment,
  WithComponents,
  useChannelStateContext,
} from "stream-chat-react";

import Sidebar from "../components/Sidebar";
import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import { useThemeStore } from "../Store/useThemeStore";
import AIChatActions from "../components/AIChatActions";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

/* =========================================================
   CHAT HEADER
========================================================= */

const ChatHeader = ({ handleVideoCall }) => {
  const navigate = useNavigate();
  const { channel } = useChannelStateContext();

  const members = Object.values(channel?.state?.members || {});

  const currentUserId = channel?._client?.userID;

  const otherMember = members.find(
    (member) => member.user_id !== currentUserId
  );

  const user = otherMember?.user;

  const name =
    user?.name ||
    user?.fullName ||
    user?.full_name ||
    otherMember?.name ||
    "Chat User";

  const profileImage =
    user?.image ||
    user?.profilePic ||
    user?.profileImage ||
    otherMember?.image ||
    "";

  const isOnline = user?.online ?? false;

  return (
    <div
      className="
    sticky top-0 z-20
    flex h-16 w-full shrink-0
    items-center justify-between gap-2
    border-b border-base-300
    bg-base-100 px-3
    sm:h-[72px] sm:gap-3 sm:px-5
  "
    >
      {/* Contact profile and name */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="
    -ml-1 flex size-9 shrink-0
    items-center justify-center
    rounded-full
    text-base-content/80
    transition-all duration-200
    hover:bg-base-200
    active:scale-95
    sm:hidden
  "
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="relative size-10 shrink-0">
          <img
            src={
              profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=243b63&color=ffffff`
            }
            alt={name}
            className="
              size-10 rounded-full
              object-cover ring-2 ring-base-300
            "
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=243b63&color=ffffff`;
            }}
          />

          <span
            className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-100 ${isOnline ? "bg-success" : "bg-base-content/30"
              }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-base-content sm:text-base">
            {name}
          </h2>

          <p
            className={`text-xs ${isOnline ? "text-success" : "text-base-content/50"
              }`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Video call button */}
      <div className="relative z-30 ml-auto flex shrink-0 items-center">
        <CallButton handleVideoCall={handleVideoCall} />
      </div>
    </div>
  );
};

/* =========================================================
   IMAGE VIEWER
========================================================= */

const CustomImage = (props) => {
  const { attachment, imageUrl, fallback, ...rest } = props;

  const [viewerOpen, setViewerOpen] = useState(false);

  const src =
    imageUrl ||
    attachment?.image_url ||
    attachment?.thumb_url ||
    attachment?.url;

  if (!src) {
    return fallback || null;
  }

  return (
    <>
      {/* CHAT IMAGE */}

      <button
        type="button"
        onClick={() => setViewerOpen(true)}
        className="
          block
          max-w-full
          cursor-pointer
          overflow-hidden
          rounded-xl
          border
          border-base-300
          bg-base-200
          p-0
          text-left
        "
      >
        <img
          {...rest}
          src={src}
          alt={attachment?.title || attachment?.name || "Image"}
          className="
            max-h-[240px]
            max-w-full
            rounded-xl
            object-contain
            sm:max-h-[320px]
          "
        />
      </button>

      {/* FULL SCREEN IMAGE VIEWER */}

      {viewerOpen && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/95
            p-3
            sm:p-4
          "
        >
          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={() => setViewerOpen(false)}
            className="
              absolute
              left-3
              top-[max(0.75rem,env(safe-area-inset-top))]
              z-10
              flex
              items-center
              gap-1.5
              rounded-lg
              bg-white
              px-3
              py-2
              text-sm
              font-semibold
              text-black
              shadow-lg
              transition
              hover:bg-gray-200
              active:scale-95
              sm:left-4
              sm:top-4
              sm:gap-2
              sm:px-4
            "
          >
            <ArrowLeft className="size-[18px] sm:size-5" />
            Back
          </button>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={() => setViewerOpen(false)}
            aria-label="Close"
            className="
              absolute
              right-3
              top-[max(0.75rem,env(safe-area-inset-top))]
              z-10
              rounded-full
              bg-white
              p-2
              text-black
              shadow-lg
              transition
              hover:bg-gray-200
              active:scale-95
              sm:right-4
              sm:top-4
            "
          >
            <X className="size-[18px] sm:size-5" />
          </button>

          {/* IMAGE */}

          <img
            src={src}
            alt={attachment?.title || attachment?.name || "Image preview"}
            className="
              max-h-[80dvh]
              max-w-full
              object-contain
              sm:max-h-[90dvh]
              sm:max-w-[95vw]
            "
          />
        </div>
      )}
    </>
  );
};

/* =========================================================
   FILE VIEWER
========================================================= */

const CustomFile = (props) => {
  const { attachment } = props;

  const [viewerOpen, setViewerOpen] = useState(false);

  const fileUrl = attachment?.asset_url || attachment?.url;

  const fileName =
    attachment?.title ||
    attachment?.name ||
    attachment?.file_name ||
    "File";

  if (!fileUrl) {
    return null;
  }

  return (
    <>
      {/* CHAT FILE */}

      <button
        type="button"
        onClick={() => setViewerOpen(true)}
        className="
          flex
          w-full
          max-w-full
          items-center
          gap-3
          rounded-xl
          border
          border-base-300
          bg-base-200
          p-3
          text-left
          transition
          hover:bg-base-300
          sm:max-w-sm
        "
      >
        <div
          className="
            flex
            size-11
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-base-100
          "
        >
          <FileText size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{fileName}</p>

          <p className="text-xs text-base-content/50">Tap to open</p>
        </div>
      </button>

      {/* FULL SCREEN FILE VIEWER */}

      {viewerOpen && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            flex-col
            bg-base-100
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
              gap-2
              border-b
              border-base-300
              bg-base-100
              px-3
              py-2
              pt-[calc(0.5rem+env(safe-area-inset-top))]
              shadow-sm
              sm:h-16
              sm:gap-3
              sm:px-4
              sm:py-0
              sm:pt-0
            "
          >
            {/* BACK */}

            <button
              type="button"
              onClick={() => setViewerOpen(false)}
              className="
                flex
                shrink-0
                items-center
                gap-1.5
                rounded-lg
                bg-base-200
                px-3
                py-2
                text-sm
                font-semibold
                transition
                hover:bg-base-300
                active:scale-95
                sm:gap-2
                sm:px-4
              "
            >
              <ArrowLeft className="size-[18px] sm:size-5" />
              Back
            </button>

            {/* FILE NAME */}

            <p
              className="
                min-w-0
                flex-1
                truncate
                text-center
                text-sm
                font-medium
              "
            >
              {fileName}
            </p>

            {/* DOWNLOAD */}

            <a
              href={fileUrl}
              download
              aria-label="Download"
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-lg
                bg-base-200
                px-3
                py-2
                text-sm
                transition
                hover:bg-base-300
                active:scale-95
              "
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>

          {/* FILE CONTENT */}

          <div
            className="
              min-h-0
              flex-1
              overflow-auto
              bg-base-200
              p-2
              pb-[max(0.5rem,env(safe-area-inset-bottom))]
              sm:p-4
            "
          >
            <iframe
              src={fileUrl}
              title={fileName}
              className="
                h-full
                min-h-[60dvh]
                w-full
                rounded-lg
                border
                border-base-300
                bg-white
                sm:min-h-[80dvh]
              "
            />
          </div>
        </div>
      )}
    </>
  );
};

/* =========================================================
   CUSTOM ATTACHMENT
========================================================= */

const CustomAttachment = (props) => {
  return <Attachment {...props} Image={CustomImage} File={CustomFile} />;
};

/* =========================================================
   CHAT PAGE
========================================================= */

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const { theme } = useThemeStore();
  const { authUser } = useAuthUser();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     STREAM TOKEN
  ========================================================= */

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  /* =========================================================
     INITIALIZE CHAT
  ========================================================= */

  useEffect(() => {
    let client = null;
    let cancelled = false;

    setChatClient(null);
    setChannel(null);

    const initChat = async () => {
      if (!tokenData?.token || !authUser || !targetUserId) {
        return;
      }

      try {
        setLoading(true);

        client = new StreamChat(STREAM_API_KEY, {
          timeout: 10000,
        });

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        if (cancelled) {
          await client.disconnectUser().catch(() => { });

          client = null;
          return;
        }

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currentChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currentChannel.watch();

        if (cancelled) {
          await client.disconnectUser().catch(() => { });

          client = null;
          return;
        }

        setChatClient(client);
        setChannel(currentChannel);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Error initializing chat:", error);

        toast.error("Could not connect to chat. Please try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initChat();

    return () => {
      cancelled = true;

      if (client) {
        client.disconnectUser().catch(() => { });
      }
    };
  }, [authUser, targetUserId, tokenData]);

  /* =========================================================
     VIDEO CALL
  ========================================================= */

  const handleVideoCall = async () => {
    if (!channel) return;

    const callUrl = `${window.location.origin}/call/${channel.id}`;

    try {
      await channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    } catch (error) {
      console.error("Error sending video call link:", error);

      toast.error("Failed to send video call link.");
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading || !chatClient || !channel) {
    return <ChatLoader />;
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div
      data-theme={theme}
      className="fixed inset-0 overflow-hidden bg-base-200 text-base-content"
    >
      <Sidebar />

      <main className="h-full min-w-0 w-full overflow-hidden lg:ml-72 lg:w-[calc(100%-18rem)]">
        <div className="flex h-full w-full overflow-hidden bg-base-200 p-0 sm:p-2 lg:p-4">
          {/* ...the rest stays exactly the same... */}
          <div
            className="
              flex
              h-full
              min-h-0
              min-w-0
              w-full
              overflow-hidden
              rounded-none
              border-0
              border-base-300
              bg-base-100
              shadow-xl
              sm:rounded-2xl
              sm:border
            "
          >
            <div
              className="
                h-full
                min-h-0
                min-w-0
                w-full
              "
            >
              <Chat client={chatClient} theme="str-chat__theme-dark">
                <WithComponents
                  overrides={{
                    Attachment: CustomAttachment,
                  }}
                >
                  <Channel channel={channel}>
                    <div
                      className="
                        flex
                        h-full
                        min-h-0
                        min-w-0
                        w-full
                        flex-col
                      "
                    >
                      <ChatHeader handleVideoCall={handleVideoCall} />

                      <div
                        className="
                          min-h-0
                          min-w-0
                          w-full
                          flex-1
                        "
                      >
                        <Window>
                          <MessageList />

                          {/* safe-area padding keeps the composer clear of the
                              iPhone home indicator */}
                          <div className="shrink-0 pb-[env(safe-area-inset-bottom)]">
                            <AIChatActions />
                            <MessageComposer />
                          </div>
                        </Window>
                      </div>
                    </div>
                  </Channel>
                </WithComponents>
              </Chat>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;