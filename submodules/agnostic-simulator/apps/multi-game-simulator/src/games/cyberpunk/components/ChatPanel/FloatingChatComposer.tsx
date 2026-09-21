import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { CHAT_MAX_LENGTH, CHAT_PRESET_KEYS, CHAT_PRESETS, useEngine } from "../../engine";
import classes from "./FloatingChatComposer.module.css";

/**
 * Floating compose dock for the unified activity feed (log + chat merged).
 * Messages render inline in the feed, so this dock only composes — the same
 * pattern as the Flesh and Blood practice sidebar chat: a floating round
 * toggle in the feed corner that opens quick presets and the text composer.
 */
export function FloatingChatComposer() {
  const {
    canSendChat,
    freeTextEnabled,
    freeTextProposalPending,
    canRequestFreeText,
    requestFreeTextChat,
    sendChatPreset,
    sendChatText,
  } = useEngine();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const trimmed = draft.trim();
  const canSendText =
    canSendChat && freeTextEnabled && trimmed.length > 0 && trimmed.length <= CHAT_MAX_LENGTH;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSendText) return;
    sendChatText(trimmed);
    setDraft("");
  };

  return (
    <div className={classes.dock} data-open={open ? "true" : "false"}>
      {open ? (
        <div className={classes.compose} data-testid="chat-composer">
          {canSendChat ? (
            <div className={classes.presets} data-testid="chat-presets">
              {CHAT_PRESET_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={classes.presetChip}
                  data-testid="chat-quick"
                  data-quick-id={key}
                  onClick={() => sendChatPreset(key)}
                >
                  {CHAT_PRESETS[key]}
                </button>
              ))}
            </div>
          ) : null}
          {freeTextEnabled && canSendChat ? (
            <form className={classes.inputRow} onSubmit={submit}>
              <input
                ref={inputRef}
                className={classes.input}
                data-testid="chat-input"
                value={draft}
                maxLength={CHAT_MAX_LENGTH}
                placeholder="Type a message…"
                aria-label="Chat message"
                onChange={(event) => setDraft(event.currentTarget.value.replace(/\n/g, ""))}
                onKeyDown={(event) => {
                  if (event.key !== "Escape") return;
                  event.preventDefault();
                  setOpen(false);
                }}
              />
              <button
                type="submit"
                className={classes.sendButton}
                data-testid="chat-send"
                disabled={!canSendText}
                aria-label="Send chat message"
              >
                <Send aria-hidden="true" size={14} />
              </button>
            </form>
          ) : (
            <div className={classes.freeTextGate} data-testid="chat-free-text-gate">
              <span className={classes.gateText}>
                {!canSendChat
                  ? "Spectators cannot send messages."
                  : canRequestFreeText
                    ? "Free text requires opponent approval."
                    : "Preset messages only in this match."}
              </span>
              {canSendChat && canRequestFreeText ? (
                <button
                  type="button"
                  className={classes.requestButton}
                  data-testid="chat-request-free-text"
                  disabled={freeTextProposalPending}
                  onClick={() => requestFreeTextChat()}
                >
                  {freeTextProposalPending ? "Waiting for opponent…" : "Request free text"}
                </button>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
      <button
        type="button"
        className={classes.toggle}
        aria-label={open ? "Close chat composer" : "Open chat composer"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden="true" size={17} /> : <MessageCircle aria-hidden="true" size={17} />}
      </button>
    </div>
  );
}
