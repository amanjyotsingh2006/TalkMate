import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";

import {
  Chat,
  Channel,
  MessageComposer,
  MessageList,
  Window,
  useChannelStateContext,
} from "stream-chat-react";

import Sidebar from "../components/Sidebar";
import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import { useThemeStore } from "../Store/useThemeStore";

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
    user?.full_name ||
    "User";

  const profileImage =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`;

  const isOnline = user?.online;

  return (
    <div
      className="
        flex
        h-[72px]
        w-full
        shrink-0
        items-center
        justify-between
        border-b
        border-base-300
        bg-base-100
        px-4
        sm:px-6
      "
    >
      {/* ================= PROFILE + NAME ================= */}

      <div className="flex min-w-0 items-center gap-3">

        {/* Profile Image */}
        <div className="relative shrink-0">
          <img
            src={profileImage}
            alt={name}
            loading="lazy"
            className="
              h-10
              w-10
              rounded-full
              object-cover
              ring-2
              ring-base-300
            "
          />

          {/* Online Indicator */}
          <span
            className={`
              absolute
              bottom-0
              right-0
              h-3
              w-3
              rounded-full
              border-2
              border-base-100
              ${isOnline
                ? "bg-success"
                : "bg-base-content/30"
              }
            `}
          />
        </div>

        {/* Name + Status */}
        <div className="min-w-0">

          <h2
            className="
              truncate
              text-base
              font-semibold
              text-base-content
            "
          >
            {name}
          </h2>

          <p
            className={`
              text-xs
              font-medium
              ${isOnline
                ? "text-success"
                : "text-base-content/50"
              }
            `}
          >
            {isOnline ? "Online" : "Offline"}
          </p>

        </div>
      </div>

      {/* ================= VIDEO CALL ================= */}

      <div className="shrink-0">
        <CallButton
          handleVideoCall={handleVideoCall}
        />
      </div>
    </div>
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
      if (!tokenData?.token || !authUser || !targetUserId) {
        return;
      }

      try {
        setLoading(true);

        // Create a fresh client for this ChatPage instance
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

        // Stop if this effect has already been cleaned up
        if (cancelled) {
          await client.disconnectUser().catch(() => { });
          client = null;
          return;
        }

        const channelId = [authUser._id, targetUserId]
          .sort()
          .join("-");

        const currentChannel = client.channel(
          "messaging",
          channelId,
          {
            members: [authUser._id, targetUserId],
          }
        );

        await currentChannel.watch();

        // Stop if cleanup happened during watch()
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
        client.disconnectUser().catch(() => { });
      }
    };
  }, [authUser, targetUserId, tokenData]);

  /* =========================================================
     VIDEO CALL
  ========================================================= */

  const handleVideoCall = async () => {
    if (!channel) return;

    const callUrl =
      `${window.location.origin}/call/${channel.id}`;

    try {
      await channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
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
        min-h-screen
        min-w-0
        w-full
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
                        <MessageComposer focus />
                      </Window>
                    </div>

                  </div>
                </Channel>
              </Chat>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;