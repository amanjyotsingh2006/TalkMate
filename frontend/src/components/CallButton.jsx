import { VideoIcon } from "lucide-react";

const CallButton = ({ handleVideoCall }) => {
    return (
        <button
            type="button"
            onClick={handleVideoCall}
            aria-label="Start video call"
            className="relative z-50 flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#8FE388] px-4 text-sm font-semibold text-[#0B1410] shadow-md hover:bg-[#A6EC9E]"
        >
            <VideoIcon className="h-5 w-5" />
            <span>Video Call</span>
        </button>
    );
};

export default CallButton;