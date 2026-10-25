import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "../components/PageLoader";
import { useThemeStore } from "../Store/useThemeStore";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();

  const { theme } = useThemeStore();
  const { authUser, isLoading } = useAuthUser();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let videoClient;
    let callInstance;

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) {
        return;
      }

      try {
        setIsConnecting(true);

        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          token: tokenData.token,
        });

        callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);

        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      callInstance?.leave().catch(() => { });
      videoClient?.disconnectUser().catch(() => { });
    };
  }, [authUser, callId, tokenData]);

  if (isLoading || isConnecting) {
    return <PageLoader />;
  }

  return (
    <div
      data-theme={theme}
      className="
        flex
        h-[100dvh]
        w-full
        flex-col
        overflow-hidden
        bg-base-200
        text-base-content
      "
    >
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div
        className="
          flex
          shrink-0
          items-center
          justify-between
          gap-3
          border-b
          border-base-300
          bg-base-100
          px-3
          py-2.5
          pt-[max(0.625rem,env(safe-area-inset-top))]
          sm:px-5
          sm:py-3
        "
      >
        {/* LOGO */}

        <span className="truncate font-display text-base font-medium text-primary sm:text-lg">
          Streamify
        </span>

        {/* CALL TIMER */}

        {call && (
          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
              rounded-full
              border
              border-base-300
              bg-base-200
              px-3
              py-1
              text-xs
              font-medium
              text-base-content/70
              sm:px-3.5
              sm:py-1.5
              sm:text-[13px]
            "
          >
            <span className="size-1.5 rounded-full bg-success" />

            <CallTimer />
          </div>
        )}
      </div>

      {/* =====================================================
          VIDEO AREA
      ===================================================== */}

      <div
        className="
          relative
          flex
          min-h-0
          flex-1
          w-full
          items-center
          justify-center
          p-0
          sm:p-4
          lg:p-5
        "
      >
        {client && call ? (
          <div
            className="
              relative
              h-full
              w-full
              overflow-hidden
              rounded-none
              border-0
              border-base-300
              bg-base-100
              shadow-2xl

              sm:h-[97%]
              sm:w-[98%]
              sm:rounded-2xl
              sm:border

              lg:h-[96%]
              lg:w-[97%]

              xl:h-[94%]
              xl:w-[96%]
            "
          >
            <StreamVideo client={client}>
              <StreamCall call={call}>
                <CallContent />
              </StreamCall>
            </StreamVideo>
          </div>
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              px-4
              sm:px-6
            "
          >
            <div
              className="
                w-full
                max-w-md
                rounded-2xl
                border
                border-base-300
                bg-base-100
                p-6
                text-center
                shadow-2xl
                sm:p-8
              "
            >
              <h2
                className="
                  mb-2
                  text-xl
                  font-semibold
                  text-base-content
                "
              >
                Couldn't connect
              </h2>

              <p
                className="
                  text-sm
                  leading-relaxed
                  text-base-content/60
                "
              >
                We weren't able to initialize the call.
                Refresh the page to try again.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   CALL TIMER
========================================================= */

const CallTimer = () => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  return (
    <span>
      {mins}:{secs}
    </span>
  );
};

/* =========================================================
   CALL CONTENT
========================================================= */

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();
  const { id: callId } = useParams();
  const { authUser } = useAuthUser();

  useEffect(() => {
    if (callingState !== CallingState.LEFT) return;

    // callId is "userA-userB", so the other person is the id that isn't mine
    const otherUserId = callId
      ?.split("-")
      .find((id) => id !== authUser?._id);

    const chatPath = otherUserId ? `/chat/${otherUserId}` : "/";

    // 1. Try to close this tab (works when it was opened from a link or window.open)
    window.close();

    // 2. If the browser blocked it, the tab is still here, so redirect
    const timer = setTimeout(() => {
      navigate(chatPath, { replace: true });
    }, 300);

    return () => clearTimeout(timer);
  }, [callingState, callId, authUser, navigate]);

  return (
    <StreamTheme className="h-full w-full">
      <div className="relative h-full w-full">
        {/* ================= VIDEO ================= */}

        <div className="h-full w-full">
          <SpeakerLayout />
        </div>

        {/* ================= CONTROLS ================= */}
        {/* No overflow clipping here, so the reactions popup
            can open above the button. On narrow screens the
            buttons wrap onto extra rows instead of scrolling. */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            z-50
            flex
            justify-center
            px-2
            pb-[max(0.75rem,env(safe-area-inset-bottom))]
            sm:bottom-2
            sm:pb-3

            [&_.str-video__call-controls]:flex-wrap
            [&_.str-video__call-controls]:justify-center
            [&_.str-video__call-controls]:gap-1.5
            [&_.str-video__call-controls]:max-w-full
          "
        >
          <CallControls />
        </div>
      </div>
    </StreamTheme>
  );
};

export default CallPage;