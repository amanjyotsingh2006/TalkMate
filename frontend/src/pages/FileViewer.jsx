import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const FileViewer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [failed, setFailed] = useState(false);

    const fileUrl = location.state?.fileUrl;

    // If no file URL exists, go back safely (not during render)
    if (!fileUrl) {
        return <Navigate to=".." replace />;
    }

    return (
        <div className="relative flex h-[100dvh] w-full flex-col bg-black">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className="
                    absolute
                    left-3
                    top-[max(0.75rem,env(safe-area-inset-top))]
                    z-50
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-white
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-black
                    shadow-lg
                    transition
                    hover:bg-gray-200
                    active:scale-95
                    sm:left-4
                    sm:top-4
                    sm:gap-2
                    sm:px-4
                    sm:text-base
                "
            >
                <ArrowLeft className="size-[18px] sm:size-5" />
                Back
            </button>

            {/* Image area: fills the screen below the Back button */}
            <div
                className="
                    flex
                    min-h-0
                    flex-1
                    items-center
                    justify-center
                    px-2
                    pb-[max(0.75rem,env(safe-area-inset-bottom))]
                    pt-16
                    sm:p-6
                "
            >
                {failed ? (
                    <p className="text-sm text-white/70">
                        Could not load this image.
                    </p>
                ) : (
                    <img
                        src={fileUrl}
                        alt="Preview"
                        onError={() => setFailed(true)}
                        className="
                            h-full
                            w-full
                            object-contain
                        "
                    />
                )}
            </div>
        </div>
    );
};

export default FileViewer;