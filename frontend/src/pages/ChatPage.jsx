//  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Download, FileText, X, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

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
   IMAGE VIEWER (full screen on mobile, padded on desktop, zoom)
========================================================= */

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const DOUBLE_TAP_SCALE = 2.5;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const ImageViewer = ({ src, onClose }) => {
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const view = useRef({ scale: 1, x: 0, y: 0 });
  const onCloseRef = useRef(onClose);
  const [percent, setPercent] = useState(100);

  onCloseRef.current = onClose;

  // Apply the current zoom/pan straight to the DOM (smooth during gestures)
  const render = useCallback((animate) => {
    const img = imgRef.current;
    if (!img) return;

    const { scale, x, y } = view.current;

    img.style.transition = animate ? "transform 0.2s ease-out" : "none";
    img.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

    setPercent(Math.round(scale * 100));
  }, []);

  // Don't let the image be dragged away from the screen
  const clampPan = useCallback(() => {
    const img = imgRef.current;
    const stage = stageRef.current;
    if (!img || !stage) return;

    const v = view.current;
    const maxX = Math.max(0, (img.offsetWidth * v.scale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (img.offsetHeight * v.scale - stage.clientHeight) / 2);

    v.x = clamp(v.x, -maxX, maxX);
    v.y = clamp(v.y, -maxY, maxY);
  }, []);

  // Zoom to a scale, optionally keeping the point (cx, cy) under the finger/cursor
  const zoomTo = useCallback(
    (next, cx, cy, animate = true) => {
      const stage = stageRef.current;
      if (!stage) return;

      const v = view.current;
      const scale = clamp(next, MIN_SCALE, MAX_SCALE);
      const ratio = scale / v.scale;

      let px = 0;
      let py = 0;

      if (cx != null && cy != null) {
        const r = stage.getBoundingClientRect();
        px = cx - (r.left + r.width / 2);
        py = cy - (r.top + r.height / 2);
      }

      v.scale = scale;
      v.x = scale === MIN_SCALE ? 0 : px - (px - v.x) * ratio;
      v.y = scale === MIN_SCALE ? 0 : py - (py - v.y) * ratio;

      clampPan();
      render(animate);
    },
    [clampPan, render]
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const isUi = (target) => !!target.closest?.("[data-viewer-ui]");
    const dist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

    /* ---------- TOUCH (mobile) ---------- */

    let mode = null; // "pan" | "pinch"
    let ignoreTouch = false;
    let startDist = 1;
    let startScale = 1;
    let last = { x: 0, y: 0 };
    let tapStart = { x: 0, y: 0 };
    let moved = false;
    let lastTap = { time: 0, x: 0, y: 0 };
    let lastTouchAt = 0;

    const onTouchStart = (e) => {
      lastTouchAt = Date.now();

      // Taps on buttons are left alone so their click still fires
      if (isUi(e.target)) {
        ignoreTouch = true;
        return;
      }

      ignoreTouch = false;
      e.preventDefault();

      if (e.touches.length >= 2) {
        mode = "pinch";
        moved = true;
        startDist = dist(e.touches[0], e.touches[1]) || 1;
        startScale = view.current.scale;
      } else {
        mode = "pan";
        moved = false;
        last = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        tapStart = { ...last };
      }
    };

    const onTouchMove = (e) => {
      if (ignoreTouch) return;
      e.preventDefault();

      if (mode === "pinch" && e.touches.length >= 2) {
        const a = e.touches[0];
        const b = e.touches[1];

        zoomTo(
          startScale * (dist(a, b) / startDist),
          (a.clientX + b.clientX) / 2,
          (a.clientY + b.clientY) / 2,
          false
        );
      } else if (mode === "pan" && e.touches.length === 1) {
        const p = e.touches[0];

        if (Math.hypot(p.clientX - tapStart.x, p.clientY - tapStart.y) > 8) {
          moved = true;
        }

        if (view.current.scale > 1) {
          view.current.x += p.clientX - last.x;
          view.current.y += p.clientY - last.y;
          clampPan();
          render(false);
        }

        last = { x: p.clientX, y: p.clientY };
      }
    };

    const onTouchEnd = (e) => {
      if (ignoreTouch) {
        if (e.touches.length === 0) ignoreTouch = false;
        return;
      }

      e.preventDefault();

      // One finger lifted after a pinch: keep panning with the other
      if (e.touches.length === 1) {
        mode = "pan";
        last = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        tapStart = { ...last };
        return;
      }

      if (e.touches.length > 1) return;

      const wasTap = mode === "pan" && !moved;
      mode = null;

      const s = view.current.scale;
      if (s > 1 && s < 1.05) zoomTo(1);

      // Double tap toggles zoom
      if (wasTap) {
        const t = e.changedTouches[0];
        const now = Date.now();

        if (
          now - lastTap.time < 300 &&
          Math.hypot(t.clientX - lastTap.x, t.clientY - lastTap.y) < 40
        ) {
          zoomTo(view.current.scale > 1 ? 1 : DOUBLE_TAP_SCALE, t.clientX, t.clientY);
          lastTap.time = 0;
        } else {
          lastTap = { time: now, x: t.clientX, y: t.clientY };
        }
      }
    };

    const onTouchCancel = () => {
      mode = null;
      ignoreTouch = false;
    };

    /* ---------- MOUSE (desktop) ---------- */

    let dragging = false;
    let mouseMoved = false;
    let downOnBackdrop = false;
    let mStart = { x: 0, y: 0 };
    let mLast = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      // Ignore mouse events the browser emulates after a touch
      if (Date.now() - lastTouchAt < 700) return;
      if (e.button !== 0 || isUi(e.target)) return;

      dragging = true;
      mouseMoved = false;
      downOnBackdrop = e.target === stage;
      mStart = { x: e.clientX, y: e.clientY };
      mLast = { ...mStart };

      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!dragging) return;

      if (Math.hypot(e.clientX - mStart.x, e.clientY - mStart.y) > 5) {
        mouseMoved = true;
      }

      if (view.current.scale > 1) {
        view.current.x += e.clientX - mLast.x;
        view.current.y += e.clientY - mLast.y;
        clampPan();
        render(false);
      }

      mLast = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false;

      // Click on the dark padding around the image closes the viewer
      if (!mouseMoved && downOnBackdrop) onCloseRef.current();
    };

    const onDoubleClick = (e) => {
      if (isUi(e.target)) return;
      zoomTo(view.current.scale > 1 ? 1 : DOUBLE_TAP_SCALE, e.clientX, e.clientY);
    };

    const onWheel = (e) => {
      e.preventDefault();
      zoomTo(
        view.current.scale * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)),
        e.clientX,
        e.clientY,
        false
      );
    };

    /* ---------- KEYBOARD / RESIZE ---------- */

    const onKeyDown = (e) => {
      if (e.key === "Escape") onCloseRef.current();
      else if (e.key === "+" || e.key === "=") zoomTo(view.current.scale * 1.4);
      else if (e.key === "-") zoomTo(view.current.scale / 1.4);
      else if (e.key === "0") zoomTo(1);
    };

    const onResize = () => {
      clampPan();
      render(false);
    };

    const nonPassive = { passive: false };

    stage.addEventListener("touchstart", onTouchStart, nonPassive);
    stage.addEventListener("touchmove", onTouchMove, nonPassive);
    stage.addEventListener("touchend", onTouchEnd, nonPassive);
    stage.addEventListener("touchcancel", onTouchCancel, nonPassive);
    stage.addEventListener("mousedown", onMouseDown);
    stage.addEventListener("dblclick", onDoubleClick);
    stage.addEventListener("wheel", onWheel, nonPassive);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      stage.removeEventListener("touchstart", onTouchStart, nonPassive);
      stage.removeEventListener("touchmove", onTouchMove, nonPassive);
      stage.removeEventListener("touchend", onTouchEnd, nonPassive);
      stage.removeEventListener("touchcancel", onTouchCancel, nonPassive);
      stage.removeEventListener("mousedown", onMouseDown);
      stage.removeEventListener("dblclick", onDoubleClick);
      stage.removeEventListener("wheel", onWheel, nonPassive);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);

      document.body.style.overflow = prevOverflow;
    };
  }, [clampPan, render, zoomTo]);

  // Keep taps/clicks inside the viewer from reaching Stream's message handlers
  const stop = (e) => e.stopPropagation();

  return createPortal(
    <div
      ref={stageRef}
      onClick={stop}
      onDoubleClick={stop}
      onMouseDown={stop}
      onPointerDown={stop}
      onTouchStart={stop}
      onTouchEnd={stop}
      className="
        fixed inset-0 z-[99999]
        flex select-none items-center justify-center
        overflow-hidden bg-black
        px-4 md:px-20 md:py-24
      "
      style={{
        touchAction: "none",
        overscrollBehavior: "contain",
        WebkitUserSelect: "none",
      }}
    >
      {/* IMAGE: full screen on mobile, padded on desktop */}
      <img
        ref={imgRef}
        src={src}
        alt="Full-size attachment"
        draggable={false}
        className="block max-h-full max-w-full object-contain"
        style={{
          willChange: "transform",
          WebkitTouchCallout: "none",
          cursor: percent > 100 ? "grab" : "zoom-in",
        }}
      />

      {/* TOP BAR */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-3 pb-3"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          data-viewer-ui
          onClick={onClose}
          aria-label="Back"
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur active:scale-95"
        >
          <ArrowLeft className="size-5" />
        </button>

        <div
          data-viewer-ui
          className="pointer-events-auto flex items-center gap-2"
        >
          <a
            href={src}
            download
            target="_blank"
            rel="noreferrer"
            aria-label="Download"
            className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur active:scale-95"
          >
            <Download className="size-5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur active:scale-95"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* ZOOM CONTROLS */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pt-3"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div
          data-viewer-ui
          className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/15 p-1 text-white backdrop-blur"
        >
          <button
            type="button"
            onClick={() => zoomTo(view.current.scale / 1.5)}
            disabled={percent <= MIN_SCALE * 100}
            aria-label="Zoom out"
            className="flex size-10 items-center justify-center rounded-full active:scale-95 disabled:opacity-40"
          >
            <ZoomOut className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => zoomTo(1)}
            aria-label="Reset zoom"
            className="min-w-[3.5rem] px-2 text-center text-sm font-medium tabular-nums"
          >
            {percent}%
          </button>

          <button
            type="button"
            onClick={() => zoomTo(view.current.scale * 1.5)}
            disabled={percent >= MAX_SCALE * 100}
            aria-label="Zoom in"
            className="flex size-10 items-center justify-center rounded-full active:scale-95 disabled:opacity-40"
          >
            <ZoomIn className="size-5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* =========================================================
   IMAGE THUMBNAIL IN CHAT
========================================================= */

const CustomImage = (props) => {
  const { fallback } = props;

  const [viewerOpen, setViewerOpen] = useState(false);

  const src =
    props.imageUrl ||
    props.attachment?.image_url ||
    props.attachment?.thumb_url ||
    props.attachment?.url ||
    props.image_url ||
    props.thumb_url ||
    props.url;

  if (!src) return fallback || null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setViewerOpen(true);
        }}
        className="block w-full max-w-[320px] cursor-zoom-in overflow-hidden rounded-xl"
      >
        <img
          src={src}
          alt="Attachment"
          className="block h-auto max-h-[320px] w-full object-cover"
        />
      </button>

      {viewerOpen && (
        <ImageViewer src={src} onClose={() => setViewerOpen(false)} />
      )}
    </>
  );
};

/* =========================================================
   GALLERY (Stream may route chat images through this)
========================================================= */

const CustomGallery = ({ images = [] }) => (
  <div className="flex flex-col gap-1">
    {images.map((image, i) => (
      <CustomImage
        key={image.image_url || image.thumb_url || i}
        attachment={image}
      />
    ))}
  </div>
);

/* =========================================================
   FILE VIEWER (PDF preview, download only on button press)
========================================================= */

const downloadFile = async (url, name) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Bad response");

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    // If the file host blocks fetch (CORS), fall back to opening it
    window.open(url, "_blank", "noopener");
  }
};

const FileViewer = ({ fileUrl, fileName, isPdf, onClose }) => {
  const { theme } = useThemeStore();

  const bodyRef = useRef(null);

  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(0);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Measure the available width so pages fit the screen
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const update = () => setWidth(el.clientWidth);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // Escape closes + lock background scroll
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadFile(fileUrl, fileName);
    setDownloading(false);
  };

  const pageWidth = Math.max(Math.min(width - 24, 900), 200) * scale;

  const stop = (e) => e.stopPropagation();

  return createPortal(
    <div
      data-theme={theme}
      onClick={stop}
      onMouseDown={stop}
      onTouchStart={stop}
      onPointerDown={stop}
      className="fixed inset-0 z-[99999] flex flex-col bg-base-100 text-base-content"
    >
      {/* HEADER */}
      <div
        className="
          flex shrink-0 items-center justify-between gap-2
          border-b border-base-300 bg-base-100 px-3 pb-2 shadow-sm
        "
        style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="
            flex shrink-0 items-center gap-1.5 rounded-lg bg-base-200
            px-3 py-2 text-sm font-semibold transition
            hover:bg-base-300 active:scale-95
          "
        >
          <ArrowLeft className="size-[18px]" />
        </button>

        <p className="min-w-0 flex-1 truncate text-center text-sm font-medium">
          {fileName}
        </p>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          aria-label="Download"
          className="
            flex shrink-0 items-center gap-2 rounded-lg bg-base-200
            px-3 py-2 text-sm transition
            hover:bg-base-300 active:scale-95 disabled:opacity-60
          "
        >
          {downloading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Download size={18} />
          )}
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>

      {/* BODY */}
      <div
        ref={bodyRef}
        className="relative min-h-0 flex-1 overflow-auto bg-base-200 px-3 py-3"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {isPdf && !error ? (
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(e) => {
              console.error("PDF load error:", e);
              setError(true);
            }}
            loading={
              <div className="flex h-[60dvh] items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
              </div>
            }
            className="mx-auto flex w-max min-w-full flex-col items-center gap-3 pb-24"
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                width={pageWidth}
                className="overflow-hidden rounded-md shadow-md"
              />
            ))}
          </Document>
        ) : (
          <div className="flex h-full min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-base-100">
              <FileText size={32} />
            </div>

            <div>
              <p className="max-w-[80vw] truncate text-sm font-medium">
                {fileName}
              </p>
              <p className="mt-1 text-xs text-base-content/60">
                {error
                  ? "Couldn't load the preview."
                  : "Preview isn't available for this file type."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="btn btn-primary btn-sm gap-2"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        )}

        {/* ZOOM CONTROLS (PDF only) */}
        {isPdf && !error && numPages > 0 && (
          <div
            className="pointer-events-none fixed inset-x-0 bottom-0 flex justify-center"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-base-100/90 p-1 shadow-lg backdrop-blur">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))}
                disabled={scale <= 0.5}
                aria-label="Zoom out"
                className="flex size-10 items-center justify-center rounded-full active:scale-95 disabled:opacity-40"
              >
                <ZoomOut className="size-5" />
              </button>

              <button
                type="button"
                onClick={() => setScale(1)}
                aria-label="Reset zoom"
                className="min-w-[3.5rem] px-2 text-center text-sm font-medium tabular-nums"
              >
                {Math.round(scale * 100)}%
              </button>

              <button
                type="button"
                onClick={() => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)))}
                disabled={scale >= 3}
                aria-label="Zoom in"
                className="flex size-10 items-center justify-center rounded-full active:scale-95 disabled:opacity-40"
              >
                <ZoomIn className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

/* =========================================================
   FILE CARD IN CHAT
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

  if (!fileUrl) return null;

  const isPdf =
    attachment?.mime_type === "application/pdf" ||
    /\.pdf(\?|#|$)/i.test(fileName) ||
    /\.pdf(\?|#|$)/i.test(fileUrl);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setViewerOpen(true);
        }}
        className="
          flex w-full max-w-full items-center gap-3
          rounded-xl border border-base-300 bg-base-200 p-3
          text-left transition hover:bg-base-300 sm:max-w-sm
        "
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-base-100">
          <FileText size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{fileName}</p>
          <p className="text-xs text-base-content/50">Tap to preview</p>
        </div>
      </button>

      {viewerOpen && (
        <FileViewer
          fileUrl={fileUrl}
          fileName={fileName}
          isPdf={isPdf}
          onClose={() => setViewerOpen(false)}
        />
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
      Gallery={CustomGallery}
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