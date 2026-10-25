
import { useState } from "react";
import {
  useMessageComposerController,
  useStateStore,
  useChannelStateContext,
} from "stream-chat-react";
import {
  Languages,
  SpellCheck,
  Lightbulb,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const AIChatActions = () => {
  const composer = useMessageComposerController();
  const { channel } = useChannelStateContext();

  const textState = useStateStore(
    composer.textComposer.state,
    (state) => ({ text: state.text })
  );

  const [loadingAction, setLoadingAction] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const runAIAction = async (action) => {
    const message = textState?.text?.trim() || "";

    if (action !== "suggest" && !message) {
      toast.error("Type a message first.");
      return;
    }

    let targetLanguage = "";
    let conversationContext = "";

    if (action === "translate") {
      targetLanguage = window.prompt(
        "Enter the target language (e.g. Hindi, Marathi, English):"
      );

      if (!targetLanguage?.trim()) return;
      targetLanguage = targetLanguage.trim();
    }

    if (action === "suggest") {
      const messages = channel?.state?.messages || [];
      const currentUserId = channel?._client?.userID;

      const lastReceivedMessage = [...messages]
        .reverse()
        .find(
          (item) =>
            item.type !== "deleted" &&
            item.user?.id &&
            item.user.id !== currentUserId &&
            item.text?.trim()
        );

      if (!lastReceivedMessage) {
        toast.error("No received message found to reply to.");
        return;
      }

      conversationContext = lastReceivedMessage.text.trim();
      setSuggestions([]);
    }

    setLoadingAction(action);

    let data;
    try {
      const res = await axiosInstance.post("/ai/assist", {
        action,
        text: message,
        targetLanguage,
        conversationContext,
      });
      data = res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "AI request failed.");
    }

    if (!data.result?.trim()) {
      throw new Error("The AI returned an empty response.");
    }
  };

  const selectSuggestion = (suggestion) => {
    composer.textComposer.setText(suggestion);
    setSuggestions([]);
    toast.success("Reply added to your message.");
  };

  const actions = [
    {
      id: "translate",
      label: "Translate",
      Icon: Languages,
    },
    {
      id: "grammar",
      label: "Grammar Correct",
      Icon: SpellCheck,
    },
    {
      id: "suggest",
      label: "Suggestion",
      Icon: Lightbulb,
    },
  ];

  return (
    <div className="shrink-0 border-t border-base-300 px-3 py-2">
      <div className="flex flex-wrap gap-2">
        {actions.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            disabled={!!loadingAction}
            onClick={() => runAIAction(id)}
            className="
              inline-flex items-center gap-1.5
              rounded-lg border border-base-300
              bg-base-200 px-3 py-2
              text-xs font-medium text-base-content
              transition-colors hover:bg-base-300
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {loadingAction === id ? (
              <LoaderCircle
                size={15}
                className="animate-spin"
              />
            ) : (
              <Icon size={15} />
            )}

            {loadingAction === id
              ? "Working..."
              : label}
          </button>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-base-content/70">
            Choose a reply
          </p>

          {suggestions.map((suggestion, index) => (
            <button
              key={`${index}-${suggestion}`}
              type="button"
              onClick={() => selectSuggestion(suggestion)}
              className="
                block w-full rounded-lg
                border border-base-300
                bg-base-200 px-3 py-2
                text-left text-sm text-base-content
                transition-colors hover:bg-base-300
              "
            >
              {suggestion}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setSuggestions([])}
            className="text-xs text-base-content/60 hover:underline"
          >
            Dismiss suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default AIChatActions;
