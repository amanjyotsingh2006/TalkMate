import { useEffect, useState } from "react";
import { useParams } from "react-router";
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
  const { channel } = useChannelStateContext();

  const members = Object.values(
    channel?.state?.members || {}
  );

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
        relative z-20
        flex h-[72px] w-full shrink-0
        items-center justify-between gap-3
        border-b border-base-300
        bg-base-100 px-3 sm:px-5
      "
    >
      {/* Contact profile and name */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative h-10 w-10 shrink-0">
          <img
            src={
              profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=243b63&color=ffffff`
            }
            alt={name}
            className="
              h-10 w-10 rounded-full
              object-cover ring-2 ring-base-300
            "
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=243b63&color=ffffff`;
            }}
          />

          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-base-100 ${isOnline ? "bg-success" : "bg-base-content/30"
              }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm sm:text-base font-semibold text-base-content">
            {name}
          </h2>

          <p
            className={`text-xs ${isOnline
              ? "text-success"
              : "text-base-content/50"
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
  const {
    attachment,
    imageUrl,
    fallback,
    ...rest
  } = props;

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
          alt={
            attachment?.title ||
            attachment?.name ||
            "Image"
          }
          className="
            max-h-[320px]
            max-w-full
            rounded-xl
            object-contain
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
            p-4
          "
        >
          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={() => setViewerOpen(false)}
            className="
              absolute
              left-4
              top-4
              z-10
              flex
              items-center
              gap-2
              rounded-lg
              bg-white
              px-4
              py-2
              text-sm
              font-semibold
              text-black
              shadow-lg
              transition
              hover:bg-gray-200
            "
          >
            <ArrowLeft size={20} />
            Back
          </button>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={() => setViewerOpen(false)}
            className="
              absolute
              right-4
              top-4
              z-10
              rounded-full
              bg-white
              p-2
              text-black
              shadow-lg
              transition
              hover:bg-gray-200
            "
          >
            <X size={20} />
          </button>

          {/* IMAGE */}

          <img
            src={src}
            alt={
              attachment?.title ||
              attachment?.name ||
              "Image preview"
            }
            className="
              max-h-[90vh]
              max-w-[95vw]
              object-contain
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
  const {
    attachment,
    ...rest
  } = props;

  const [viewerOpen, setViewerOpen] = useState(false);

  const fileUrl =
    attachment?.asset_url ||
    attachment?.url;

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
          max-w-sm
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
        "
      >
        <div
          className="
            flex
            h-11
            w-11
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
          <p className="truncate text-sm font-medium">
            {fileName}
          </p>

          <p className="text-xs text-base-content/50">
            Click to open
          </p>
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
              h-16
              shrink-0
              items-center
              justify-between
              border-b
              border-base-300
              bg-base-100
              px-4
              shadow-sm
            "
          >
            {/* BACK */}

            <button
              type="button"
              onClick={() => setViewerOpen(false)}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-base-200
                px-4
                py-2
                text-sm
                font-semibold
                transition
                hover:bg-base-300
              "
            >
              <ArrowLeft size={20} />
              Back
            </button>

            {/* FILE NAME */}

            <p
              className="
                max-w-[45%]
                truncate
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
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-base-200
                px-3
                py-2
                text-sm
                transition
                hover:bg-base-300
              "
            >
              <Download size={18} />
              <span className="hidden sm:inline">
                Download
              </span>
            </a>
          </div>

          {/* FILE CONTENT */}

          <div
            className="
              min-h-0
              flex-1
              overflow-auto
              bg-base-200
              p-4
            "
          >
            <iframe
              src={fileUrl}
              title={fileName}
              className="
                h-full
                min-h-[80vh]
                w-full
                rounded-lg
                border
                border-base-300
                bg-white
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
  return (
    <Attachment
      {...props}
      Image={CustomImage}
      File={CustomFile}
    />
  );
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
      if (
        !tokenData?.token ||
        !authUser ||
        !targetUserId
      ) {
        return;
      }

      try {
        setLoading(true);

        client = new StreamChat(
          STREAM_API_KEY,
          {
            timeout: 10000,
          }
        );

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        if (cancelled) {
          await client
            .disconnectUser()
            .catch(() => { });

          client = null;
          return;
        }

        const channelId = [
          authUser._id,
          targetUserId,
        ]
          .sort()
          .join("-");

        const currentChannel = client.channel(
          "messaging",
          channelId,
          {
            members: [
              authUser._id,
              targetUserId,
            ],
          }
        );

        await currentChannel.watch();

        if (cancelled) {
          await client
            .disconnectUser()
            .catch(() => { });

          client = null;
          return;
        }

        setChatClient(client);
        setChannel(currentChannel);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Error initializing chat:",
          error
        );

        toast.error(
          "Could not connect to chat. Please try again."
        );
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
        client
          .disconnectUser()
          .catch(() => { });
      }
    };
  }, [
    authUser,
    targetUserId,
    tokenData,
  ]);

  /* =========================================================
     VIDEO CALL
  ========================================================= */

  const handleVideoCall = async () => {
    if (!channel) return;

    const callUrl =
      `${window.location.origin}/call/${channel.id}`;

    try {
      await channel.sendMessage({
        text:
          `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success(
        "Video call link sent successfully!"
      );
    } catch (error) {
      console.error(
        "Error sending video call link:",
        error
      );

      toast.error(
        "Failed to send video call link."
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    loading ||
    !chatClient ||
    !channel
  ) {
    return <ChatLoader />;
  }

  /* =========================================================
     PAGE
  ========================================================= */

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
      <Sidebar />

      <main
        className="
        min-h-screen min-w-0 w-full
        lg:ml-72
        lg:w-[calc(100%-18rem)]
      "
      >
        <div
          className="
            flex
            h-screen
            w-full
            overflow-hidden
            bg-base-200
            p-0
            sm:p-2
            lg:p-4
          "
        >
          <div
            className="
              flex
              h-full
              min-h-0
              min-w-0
              w-full
              overflow-hidden
              rounded-none
              border
              border-base-300
              bg-base-100
              shadow-xl
              sm:rounded-2xl
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
              <Chat
                client={chatClient}
                theme="str-chat__theme-dark"
              >
                <WithComponents
                  overrides={{
                    Attachment:
                      CustomAttachment,
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
                      <ChatHeader
                        handleVideoCall={
                          handleVideoCall
                        }
                      />

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

                          <div className="shrink-0">
                            <AIChatActions />
                            <MessageComposer focus />
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