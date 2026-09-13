import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import type { StoredGrandArchivePracticeChatMessage } from "./practice-session";

interface GrandArchivePracticeChatProps {
  readonly messages: readonly StoredGrandArchivePracticeChatMessage[];
  readonly onSendMessage: (text: string) => void;
}

export function GrandArchivePracticeChat({
  messages,
  onSendMessage,
}: GrandArchivePracticeChatProps) {
  const [draft, setDraft] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (chatOpen) inputRef.current?.focus();
  }, [chatOpen]);

  const closeChat = () => {
    setChatOpen(false);
    queueMicrotask(() => toggleRef.current?.focus());
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSendMessage(text);
    setDraft("");
  };

  return (
    <>
      {messages.length > 0 ? (
        <ol
          className="ga-practice-chat-messages"
          aria-label="Local practice chat messages"
          data-compose-open={chatOpen ? "true" : "false"}
        >
          {messages.map((message) => (
            <li key={message.id} data-message-kind="chat">
              <strong>You · Turn {message.turn}</strong>
              <span>{message.message}</span>
            </li>
          ))}
        </ol>
      ) : null}
      <div className="ga-practice-chat-dock" data-open={chatOpen ? "true" : "false"}>
        {chatOpen ? (
          <form
            className="ga-practice-chat-compose"
            onSubmit={sendMessage}
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;
              event.preventDefault();
              closeChat();
            }}
          >
            <label>
              <span>Local practice chat</span>
              <input
                ref={inputRef}
                value={draft}
                maxLength={200}
                placeholder="Message as You"
                onChange={(event) => setDraft(event.currentTarget.value)}
              />
            </label>
            <button type="submit" disabled={!draft.trim()} aria-label="Send local practice message">
              <Send aria-hidden="true" size={14} />
            </button>
            <small>Local only</small>
          </form>
        ) : null}
        <button
          ref={toggleRef}
          type="button"
          className="ga-practice-chat-toggle"
          aria-label={chatOpen ? "Close local practice chat" : "Open local practice chat"}
          aria-expanded={chatOpen}
          onClick={() => (chatOpen ? closeChat() : setChatOpen(true))}
        >
          {chatOpen ? (
            <X aria-hidden="true" size={17} />
          ) : (
            <MessageCircle aria-hidden="true" size={18} />
          )}
        </button>
      </div>
    </>
  );
}
