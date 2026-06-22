import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useStickToBottom } from "../hooks/useStickToBottom";
import classes from "./ChatPanel.module.css";

export interface ChatMessage {
  id: string;
  senderSide: "player" | "opponent" | "system";
  senderLabel: string;
  text: string;
  timestamp: string;
}

export interface ChatPanelProps {
  messages: ReadonlyArray<ChatMessage>;
  presets: ReadonlyArray<{ id: string; label: string }>;
  maxLength?: number;
  placeholder?: string;
  onSendText?: (text: string) => void;
  onSendPreset?: (presetId: string) => void;
  compact?: boolean;
}

const TIME_FMT = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function ChatPanel({
  messages,
  presets,
  maxLength = 280,
  placeholder = "Type a message…",
  onSendText,
  onSendPreset,
  compact = false,
}: ChatPanelProps) {
  const { scrollRef, onScroll } = useStickToBottom<HTMLDivElement>([messages.length]);
  const [draft, setDraft] = useState("");

  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && trimmed.length <= maxLength;

  const handleSend = () => {
    if (!canSend) return;
    onSendText?.(trimmed);
    setDraft("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        {messages.length === 0 ? (
          <div className={classes.empty}>No messages yet.</div>
        ) : (
          messages.map((m, i) => {
            const prev = messages[i - 1];
            const grouped = prev !== undefined && speakerKey(prev) === speakerKey(m);
            return <ChatBubble key={m.id} message={m} grouped={grouped} />;
          })
        )}
      </div>

      <div className={classes.presets} data-testid="chat-presets">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={classes.presetBtn}
            data-testid="chat-quick"
            data-quick-id={preset.id}
            onClick={() => onSendPreset?.(preset.id)}
          >
            {preset.label}
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
          placeholder={placeholder}
          maxLength={maxLength}
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

function speakerKey(message: ChatMessage): string {
  return message.senderSide;
}

function ChatBubble({ message, grouped }: { message: ChatMessage; grouped: boolean }) {
  const time = TIME_FMT.format(new Date(message.timestamp));
  const groupedClass = grouped ? classes.bubbleGrouped : "";
  if (message.senderSide === "system") {
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
  const tone = message.senderSide;
  return (
    <div
      className={`${classes.bubble} ${
        tone === "player" ? classes.bubblePlayer : classes.bubbleOpponent
      } ${groupedClass}`}
      data-testid="chat-message"
      data-message-id={message.id}
      data-sender={tone}
      data-sender-side={message.senderSide}
    >
      <span
        className={`${classes.chip} ${
          tone === "player" ? classes.chipPlayer : classes.chipOpponent
        }`}
      >
        {message.senderLabel}
      </span>
      <span className={classes.body}>{message.text}</span>
      <span className={classes.time}>{time}</span>
    </div>
  );
}
