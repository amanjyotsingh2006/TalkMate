import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import {
    ArrowLeft,
    Check,
    Loader2,
    MapPin,
    Save,
    ShuffleIcon,
    User,
} from "lucide-react";

import { useThemeStore } from "../Store/useThemeStore.js";
import useAuthUser from "../hooks/useAuthUser.js";
import { axiosInstance } from "../lib/axios.js";

const LANGUAGE_OPTIONS = [
    "English",
    "Hindi",
    "Marathi",
    "Gujarati",
    "Bengali",
    "Tamil",
    "Telugu",
    "Kannada",
    "Malayalam",
    "Punjabi",
    "Urdu",
    "French",
    "Spanish",
    "German",
    "Japanese",
    "Chinese",
    "Korean",
    "Other",
];

const EditProfilePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { theme } = useThemeStore();

    // Get currently logged-in user
    const { isLoading, authUser } = useAuthUser();

    const [formData, setFormData] = useState({
        fullName: "",
        location: "",
        bio: "",
        nativeLanguage: "",
        learningLanguage: "",
    });

    const [profilePic, setProfilePic] = useState("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load existing user data into the form
    useEffect(() => {
        if (!authUser) return;

        setFormData({
            fullName: authUser.fullName || "",
            location: authUser.location || "",
            bio: authUser.bio || "",
            nativeLanguage: authUser.nativeLanguage || "",
            learningLanguage: authUser.learningLanguage || "",
        });

        setProfilePic(authUser.profilePic || "");
    }, [authUser]);

    // Handle text/select input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // Generate a new random avatar
    const handleGenerateAvatar = () => {
        const randomSeed = Math.floor(Math.random() * 100000);
        const randomAvatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${randomSeed}`;

        setProfilePic(randomAvatar);
        setSuccess("");
        setError("");
    };

    // Save profile
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.fullName.trim()) {
            setError("Full name is required.");
            return;
        }

        if (!formData.nativeLanguage) {
            setError("Please select your native language.");
            return;
        }

        if (!formData.learningLanguage) {
            setError("Please select the language you want to learn.");
            return;
        }

        try {
            setSaving(true);

            // axios throws automatically on non-2xx responses
            await axiosInstance.put("/users/profile", {
                fullName: formData.fullName,
                location: formData.location,
                bio: formData.bio,
                nativeLanguage: formData.nativeLanguage,
                learningLanguage: formData.learningLanguage,
                profilePic: profilePic,
            });

            setSuccess("Profile updated successfully!");

            // Refresh auth user data
            await queryClient.invalidateQueries({
                queryKey: ["authUser"],
            });

            setTimeout(() => {
                navigate("/profile");
            }, 700);
        } catch (err) {
            console.error("Update profile error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong while updating your profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // Loading
    if (isLoading) {
        return (
            <div
                data-theme={theme}
                className="min-h-screen bg-base-200 text-base-content flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-primary" />
                    <p className="text-base-content/60">
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    // No authenticated user
    if (!authUser) {
        return (
            <div
                data-theme={theme}
                className="min-h-screen bg-base-200 text-base-content flex items-center justify-center p-6"
            >
                <div className="text-center">
                    <h2 className="text-xl font-semibold">
                        Unable to load profile
                    </h2>

                    <p className="mt-2 text-base-content/60">
                        Please log in again.
                    </p>

                    <button
                        onClick={() => navigate("/login")}
                        className="btn btn-primary mt-5"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            data-theme={theme}
            className="min-h-screen bg-base-200 text-base-content"
        >
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="btn btn-ghost btn-circle"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Edit Profile
                        </h1>
                        <p className="text-base-content/60 mt-1">
                            Update your profile information
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm">
                    <form
                        onSubmit={handleSubmit}
                        className="p-5 md:p-8 space-y-8"
                    >
                        {/* Profile Avatar */}
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-base-200 border-4 border-base-300">
                                    {profilePic ? (
                                        <img
                                            src={profilePic}
                                            alt="Profile avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User
                                                size={55}
                                                className="text-base-content/30"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2 mt-4">
                                <span className="text-sm text-base-content/50">
                                    Don't like your avatar?
                                </span>

                                <button
                                    type="button"
                                    onClick={handleGenerateAvatar}
                                    className="btn btn-outline btn-sm rounded-full"
                                >
                                    <ShuffleIcon size={16} />
                                    Generate Avatar
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="alert alert-success">
                                <Check size={18} />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Personal Information */}
                        <div>
                            <h2 className="text-lg font-semibold mb-5">
                                Personal Information
                            </h2>

                            <div className="space-y-5">
                                {/* Full Name */}
                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Full Name
                                        <span className="text-error ml-1">*</span>
                                    </label>

                                    <div className="relative">
                                        <User
                                            size={18}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
                                        />

                                        <input
                                            id="fullName"
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label
                                        htmlFor="location"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Location
                                    </label>

                                    <div className="relative">
                                        <MapPin
                                            size={18}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
                                        />

                                        <input
                                            id="location"
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g. Mumbai, India"
                                            className="input input-bordered w-full pl-10 focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div>
                                    <label
                                        htmlFor="bio"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Bio
                                    </label>

                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Tell others a little about yourself..."
                                        rows={4}
                                        maxLength={500}
                                        className="textarea textarea-bordered w-full resize-none focus:outline-none focus:border-primary"
                                    />

                                    <div className="flex justify-end mt-1">
                                        <span className="text-xs text-base-content/40">
                                            {formData.bio.length}/500
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Language Information */}
                        <div className="border-t border-base-300 pt-8">
                            <h2 className="text-lg font-semibold mb-5">
                                Language Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Native Language */}
                                <div>
                                    <label
                                        htmlFor="nativeLanguage"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Native Language
                                        <span className="text-error ml-1">*</span>
                                    </label>

                                    <select
                                        id="nativeLanguage"
                                        name="nativeLanguage"
                                        value={formData.nativeLanguage}
                                        onChange={handleChange}
                                        className="select select-bordered w-full focus:outline-none focus:border-primary"
                                    >
                                        {formData.nativeLanguage && (
                                            <option value={formData.nativeLanguage}>
                                                {formData.nativeLanguage}
                                            </option>
                                        )}

                                        {LANGUAGE_OPTIONS.map((lang) => (
                                            <option key={lang} value={lang}>
                                                {lang}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Learning Language */}
                                <div>
                                    <label
                                        htmlFor="learningLanguage"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Learning Language
                                        <span className="text-error ml-1">*</span>
                                    </label>

                                    <select
                                        id="learningLanguage"
                                        name="learningLanguage"
                                        value={formData.learningLanguage}
                                        onChange={handleChange}
                                        className="select select-bordered w-full focus:outline-none focus:border-primary"
                                    >
                                        {formData.learningLanguage && (
                                            <option value={formData.learningLanguage}>
                                                {formData.learningLanguage}
                                            </option>
                                        )}

                                        {LANGUAGE_OPTIONS.map((lang) => (
                                            <option key={lang} value={lang}>
                                                {lang}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="border-t border-base-300 pt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/profile")}
                                className="btn btn-ghost"
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;