import { VideoIcon } from "lucide-react";

const CallButton = ({ handleVideoCall }) => {
    return (
        <button
            type="button"
            onClick={handleVideoCall}
            aria-label="Start video call"
            className="
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#8FE388]
                px-4
                py-2
                text-[13px]
                font-semibold
                text-[#0B1410]
                shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
                transition-all
                duration-200
                hover:bg-[#A6EC9E]
                hover:shadow-[0_0_0_1px_rgba(143,227,136,0.4),0_8px_22px_-8px_rgba(143,227,136,0.5)]
                active:scale-95
            "
        >
            <VideoIcon className="h-4 w-4" />
        </button>
    );
};

export default CallButton;