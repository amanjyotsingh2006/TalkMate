import React from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const FileViewer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const fileUrl = location.state?.fileUrl;

    // If no file URL exists, go back
    if (!fileUrl) {
        navigate(-1);
        return null;
    }

    return (
        <div className="relative min-h-screen bg-black">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="
                    absolute
                    left-4
                    top-4
                    z-50
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-white
                    px-4
                    py-2
                    font-medium
                    text-black
                    shadow-lg
                    transition
                    hover:bg-gray-200
                "
            >
                <ArrowLeft size={20} />
                Back
            </button>

            {/* File / Image */}
            <div className="flex min-h-screen items-center justify-center p-6">
                <img
                    src={fileUrl}
                    alt="Preview"
                    className="
                        max-h-[90vh]
                        max-w-full
                        object-contain
                    "
                />
            </div>
        </div>
    );
};

export default FileViewer;