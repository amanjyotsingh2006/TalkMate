import { Link } from "react-router";
import { MessageCircle, ArrowRight } from "lucide-react";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  const { _id, profilePic, fullName, nativeLanguage, learningLanguage } = friend;

  return (
    <div className="friend-card group overflow-hidden rounded-2xl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
        .friend-card {
          background: #101B15;
          border: 1px solid #1D2C22;
          font-family: 'Inter', sans-serif;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .friend-card:hover {
          transform: translateY(-4px);
          border-color: rgba(143,227,136,0.3);
          box-shadow: 0 16px 34px -14px rgba(0,0,0,0.55);
        }
        .font-display { font-family: 'Fraunces', serif; }
        .lang-row { background: rgba(255,255,255,0.02); border: 1px solid #1D2C22; }
        .msg-btn { transition: box-shadow 0.2s ease, background 0.2s ease, transform 0.15s ease; }
        .msg-btn:hover { background: #A6EC9E; box-shadow: 0 10px 26px -10px rgba(143,227,136,0.5); }
        .msg-btn:active { transform: scale(0.98); }
      `}</style>

      <div className="relative h-20" style={{
        background: "linear-gradient(120deg, rgba(143,227,136,0.16), rgba(125,184,232,0.08) 60%, transparent)"
      }}>
        <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full bg-[#8FE388]/10 blur-xl" />
        <div className="absolute -left-8 top-4 h-20 w-20 rounded-full bg-[#7DB8E8]/10 blur-xl" />

        <div className="absolute left-5 top-7">
          <div className="relative">
            <img
              src={
                profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
              }
              alt={fullName}
              loading="lazy"
              className="h-20 w-20 rounded-full border-4 border-[#101B15] object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#101B15] bg-[#8FE388]" />
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-12">
        <div className="mb-4">
          <h3 className="truncate font-display text-lg text-[#F3F1EA]">{fullName}</h3>
          <p className="mt-1 text-xs text-[#6F7D74]">Language exchange partner</p>
        </div>

        <div className="mb-5 space-y-2">
          <div className="lang-row flex items-center justify-between rounded-xl px-3 py-2">
            <span className="text-xs font-medium text-[#6F7D74]">Native</span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[#F3F1EA]">
              {getLanguageFlag(nativeLanguage)}
              {nativeLanguage || "Not specified"}
            </span>
          </div>

          <div className="lang-row flex items-center justify-between rounded-xl px-3 py-2">
            <span className="text-xs font-medium text-[#6F7D74]">Learning</span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[#F3F1EA]">
              {getLanguageFlag(learningLanguage)}
              {learningLanguage || "Not specified"}
            </span>
          </div>
        </div>

        <Link
          to={`/chat/${_id}`}
          className="msg-btn group/btn flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#8FE388] px-4 text-sm font-semibold text-[#0B1410]"
        >
          <MessageCircle size={18} />
          <span>Message</span>
          <ArrowRight
            size={16}
            className="ml-auto transition-transform duration-200 group-hover/btn:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export const getLanguageFlag = (language) => {
  if (!language) return null;

  const languageKey = language.toLowerCase().trim();
  const countryCode = LANGUAGE_TO_FLAG[languageKey];

  if (!countryCode) return null;

  return (
    <img
      src={`https://flagcdn.com/24x18/${countryCode}.png`}
      alt={`${language} flag`}
      loading="lazy"
      className="h-3.5 w-5 rounded-[2px] object-cover"
    />
  );
};