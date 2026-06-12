import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useStickToBottom } from "@tcg/simulator-ui";
import {
  CHAT_MAX_LENGTH,
  CHAT_PRESET_KEYS,
  CHAT_PRESETS,
  chatMessageText,
  useEngine,
  type ChatMessage,
  type ChatPresetKey,
} from "../../engine";
import classes from "./ChatPanel.module.css";

const TIME_FMT = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function ChatPanel({ compact = false }: { compact?: boolean } = {}) {
  const { chatMessages, sendChatPreset, sendChatText, humanSide } = useEngine();
  const { scrollRef, onScroll } = useStickToBottom<HTMLDivElement>([chatMessages.length]);
  const [draft, setDraft] = useState("");

  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && trimmed.length <= CHAT_MAX_LENGTH;

  const handleSend = () => {
    if (!canSend) {
      return;
    }
    sendChatText(trimmed);
    setDraft("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Strip newlines defensively even though <input> doesn't allow them.
    setDraft(e.target.value.replace(/\n/g, ""));
  };

  return (
    <div className={`${classes.panel} ${compact ? classes.panelCompact : ""}`} data-testid="chat">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className={classes.scroll}
        role="log"
        aria-live="polite"
        data-testid="chat-messages"
      >
        {chatMessages.length === 0 ? (
          <div className={classes.empty}>No messages yet.</div>
        ) : (
          chatMessages.map((m, i) => {
            const prev = chatMessages[i - 1];
            const grouped = prev !== undefined && speakerKey(prev) === speakerKey(m);
            return <ChatBubble key={m.id} message={m} humanSide={humanSide} grouped={grouped} />;
          })
        )}
      </div>

      <div className={classes.presets} data-testid="chat-presets">
        {CHAT_PRESET_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={classes.presetBtn}
            data-testid="chat-quick"
            data-quick-id={key}
            onClick={() => sendChatPreset(key as ChatPresetKey)}
          >
            {CHAT_PRESETS[key as ChatPresetKey]}
          </button>
        ))}
      </div>

      <div className={classes.inputRow}>
        <input
          type="text"
          className={classes.input}
          data-testid="chat-input"
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          maxLength={CHAT_MAX_LENGTH}
          aria-label="Chat message"
        />
        <button
          type="button"
          className={classes.sendBtn}
          data-testid="chat-send"
          onClick={handleSend}
          disabled={!canSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

/**
 * Stable speaker identity used to group consecutive messages from the same
 * source. System messages always group with each other; player and opponent
 * group separately by `senderSide`.
 */
function speakerKey(message: ChatMessage): string {
  if (message.kind === "system") {
    return "system";
  }
  return `side:${message.senderSide}`;
}

function ChatBubble({
  message,
  humanSide,
  grouped,
}: {
  message: ChatMessage;
  humanSide: "player" | "opponent";
  grouped: boolean;
}) {
  const time = TIME_FMT.format(new Date(message.timestamp));
  const groupedClass = grouped ? classes.bubbleGrouped : "";
  if (message.kind === "system") {
    return (
      <div
        className={`${classes.bubble} ${classes.bubbleSystem} ${groupedClass}`}
        data-testid="chat-message"
        data-message-id={message.id}
        data-sender="system"
      >
        <span className={`${classes.chip} ${classes.chipSystem}`}>System</span>
        <span className={classes.body}>{message.text}</span>
        <span className={classes.time}>{time}</span>
      </div>
    );
  }
  const isYou = message.senderSide === humanSide;
  const tone = isYou ? "player" : "opponent";
  return (
    <div
      className={`${classes.bubble} ${
        tone === "player" ? classes.bubblePlayer : classes.bubbleOpponent
      } ${groupedClass}`}
      data-testid="chat-message"
      data-message-id={message.id}
      data-sender={isYou ? "you" : "rival"}
      data-sender-side={message.senderSide}
    >
      <span
        className={`${classes.chip} ${
          tone === "player" ? classes.chipPlayer : classes.chipOpponent
        }`}
      >
        {isYou ? "You" : "Rival"}
      </span>
      <span className={classes.body}>{chatMessageText(message)}</span>
      <span className={classes.time}>{time}</span>
    </div>
  );
}
