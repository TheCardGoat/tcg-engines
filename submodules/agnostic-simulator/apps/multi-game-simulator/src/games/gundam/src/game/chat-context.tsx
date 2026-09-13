import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { ChatPresetKey, GundamChatMessage } from "./chat.ts";

const CHAT_LOG_CAP = 200;

export interface GundamChatContextValue {
  /** Chat history, oldest first. */
  readonly chatMessages: readonly GundamChatMessage[];
  /** True when the current viewer may send chat messages. */
  readonly canSendChat: boolean;
  /** True when free-text chat is enabled for this match. */
  readonly freeTextEnabled: boolean;
  /** True while a free-text approval request is outstanding. */
  readonly freeTextProposalPending: boolean;
  /** True when the viewer may request free-text approval. */
  readonly canRequestFreeText: boolean;
  /** Send a canned chat message attributed to the viewer. */
  readonly sendChatPreset: (key: ChatPresetKey) => void;
  /** Send a free-text chat message attributed to the viewer. */
  readonly sendChatText: (text: string) => void;
  /** Request opponent approval for free-text chat. */
  readonly requestFreeTextChat: () => boolean;
}

/**
 * Remote (server-authoritative) chat wiring for live matches. When any of
 * the remote senders is provided, chat history and free-text policy are
 * driven by the server instead of local state — mirroring cyberpunk's
 * EngineProvider hosted-chat branch. Local surfaces (practice, vs-AI,
 * bot-vs-bot) omit this entirely and get local-only chat with free text
 * enabled by default.
 */
export interface GundamChatRemoteWiring {
  /** Server-authority chat history collected from the gateway. */
  readonly remoteChatMessages?: readonly GundamChatMessage[];
  /** Whether the current hosted viewer may send chat messages. */
  readonly canSendChat?: boolean;
  /** Hosted chat free-text state collected from the gateway. */
  readonly remoteFreeTextEnabled?: boolean;
  /** Hosted chat free-text proposal state owned by the live match shell. */
  readonly remoteFreeTextProposalPending?: boolean;
  /** Whether the hosted viewer may request free-text approval. */
  readonly canRequestFreeText?: boolean;
  /** Hosted chat preset sender. When omitted, presets are local-only. */
  readonly sendRemoteChatPreset?: (key: ChatPresetKey) => boolean;
  /** Hosted chat free-text sender. When omitted, free text is local-only. */
  readonly sendRemoteChatText?: (text: string) => boolean;
  /** Hosted free-text approval request sender. */
  readonly requestRemoteFreeTextChat?: () => boolean;
}

export interface GundamChatProviderProps extends GundamChatRemoteWiring {
  readonly children: ReactNode;
}

const GundamChatContext = createContext<GundamChatContextValue | null>(null);

export function GundamChatProvider({
  remoteChatMessages = [],
  canSendChat = true,
  remoteFreeTextEnabled = false,
  remoteFreeTextProposalPending = false,
  canRequestFreeText = false,
  sendRemoteChatPreset,
  sendRemoteChatText,
  requestRemoteFreeTextChat,
  children,
}: GundamChatProviderProps) {
  const [chatMessages, setChatMessages] = useState<GundamChatMessage[]>(() =>
    remoteChatMessages.slice(-CHAT_LOG_CAP),
  );
  const hasHostedChat =
    Boolean(sendRemoteChatPreset) ||
    Boolean(sendRemoteChatText) ||
    Boolean(requestRemoteFreeTextChat);
  const freeTextEnabled = hasHostedChat ? remoteFreeTextEnabled : true;
  const freeTextProposalPending = hasHostedChat ? remoteFreeTextProposalPending : false;
  const canRequestFreeTextChat =
    hasHostedChat && canRequestFreeText && !freeTextEnabled && Boolean(requestRemoteFreeTextChat);

  const chatIdRef = useRef(0);

  useEffect(() => {
    if (!hasHostedChat) {
      return;
    }
    setChatMessages(remoteChatMessages.slice(-CHAT_LOG_CAP));
    chatIdRef.current = remoteChatMessages.reduce((max, message) => Math.max(max, message.id), 0);
  }, [hasHostedChat, remoteChatMessages]);

  const sendChatPreset = useCallback(
    (key: ChatPresetKey) => {
      if (!canSendChat) {
        return;
      }
      if (sendRemoteChatPreset) {
        sendRemoteChatPreset(key);
        return;
      }
      setChatMessages((prev) => {
        const next = prev.concat({
          kind: "preset",
          id: ++chatIdRef.current,
          timestamp: Date.now(),
          senderSide: "player",
          presetKey: key,
        });
        return next.length > CHAT_LOG_CAP ? next.slice(next.length - CHAT_LOG_CAP) : next;
      });
    },
    [canSendChat, sendRemoteChatPreset],
  );

  const sendChatText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!canSendChat || !trimmed || !freeTextEnabled) {
        return;
      }
      if (sendRemoteChatText) {
        sendRemoteChatText(trimmed);
        return;
      }
      setChatMessages((prev) => {
        const next = prev.concat({
          kind: "text",
          id: ++chatIdRef.current,
          timestamp: Date.now(),
          senderSide: "player",
          text: trimmed,
        });
        return next.length > CHAT_LOG_CAP ? next.slice(next.length - CHAT_LOG_CAP) : next;
      });
    },
    [canSendChat, freeTextEnabled, sendRemoteChatText],
  );

  const requestFreeTextChat = useCallback(() => {
    if (!canSendChat || !canRequestFreeTextChat || freeTextProposalPending) {
      return false;
    }
    return requestRemoteFreeTextChat?.() ?? false;
  }, [canRequestFreeTextChat, canSendChat, freeTextProposalPending, requestRemoteFreeTextChat]);

  const value = useMemo<GundamChatContextValue>(
    () => ({
      chatMessages,
      canSendChat,
      freeTextEnabled,
      freeTextProposalPending,
      canRequestFreeText: canRequestFreeTextChat,
      sendChatPreset,
      sendChatText,
      requestFreeTextChat,
    }),
    [
      chatMessages,
      canSendChat,
      freeTextEnabled,
      freeTextProposalPending,
      canRequestFreeTextChat,
      sendChatPreset,
      sendChatText,
      requestFreeTextChat,
    ],
  );

  return <GundamChatContext.Provider value={value}>{children}</GundamChatContext.Provider>;
}

export function useGundamChat(): GundamChatContextValue {
  const ctx = useContext(GundamChatContext);
  if (!ctx) throw new Error("useGundamChat must be used inside <GundamChatProvider>");
  return ctx;
}

/**
 * Non-throwing accessor. Returns `null` outside a `<GundamChatProvider>` so
 * purely presentational components (e.g. MatchEventLog unit tests) degrade
 * to a plain event log without the chat overlay.
 */
export function useOptionalGundamChat(): GundamChatContextValue | null {
  return useContext(GundamChatContext);
}
