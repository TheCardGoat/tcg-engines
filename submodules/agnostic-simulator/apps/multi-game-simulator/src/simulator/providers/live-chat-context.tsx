import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { z } from "zod";
import type { EngineInteractionView } from "@tcg/protocol";
import { CHAT_PRESET_KEYS, CHAT_PRESETS, systemChatMessageText } from "@tcg/simulator-runtime/chat";
import { type ChatMessage } from "@tcg/simulator-ui";
import { acquireRootGatewayHandle } from "../../lib/gateway/root-socket";

const wireMessage = z.discriminatedUnion("kind", [
  z.object({
    id: z.string(),
    kind: z.literal("preset"),
    senderPlayerId: z.string(),
    createdAt: z.iso.datetime({ offset: true }),
    presetKey: z.enum(CHAT_PRESET_KEYS),
  }),
  z.object({
    id: z.string(),
    kind: z.literal("text"),
    senderPlayerId: z.string(),
    createdAt: z.iso.datetime({ offset: true }),
    text: z.string(),
  }),
  z.object({
    id: z.string(),
    kind: z.literal("system"),
    createdAt: z.iso.datetime({ offset: true }),
    systemEvent: z.string(),
  }),
]);

function toUiMessage(value: unknown, viewerId: string): ChatMessage | null {
  const parsed = wireMessage.safeParse(value);
  if (!parsed.success) return null;
  const message = parsed.data;
  const senderSide =
    message.kind === "system"
      ? "system"
      : message.senderPlayerId === viewerId
        ? "player"
        : "opponent";
  return {
    id: message.id,
    senderSide,
    senderLabel: senderSide === "system" ? "System" : senderSide === "player" ? "You" : "Rival",
    text:
      message.kind === "preset"
        ? CHAT_PRESETS[message.presetKey]
        : message.kind === "text"
          ? message.text
          : systemChatMessageText(message.systemEvent),
    timestamp: message.createdAt,
  };
}

function toUiMessages(values: readonly unknown[], viewerId: string): ChatMessage[] {
  return values.flatMap((value) => {
    const message = toUiMessage(value, viewerId);
    return message ? [message] : [];
  });
}

interface LiveChatValue {
  messages: ChatMessage[];
  freeTextEnabled: boolean;
  sendPreset: (presetKey: string) => void;
  sendText: (text: string) => void;
}
const LiveChatContext = createContext<LiveChatValue | null>(null);
export function useSimulatorLiveChat(): LiveChatValue {
  const value = useContext(LiveChatContext);
  if (!value) throw new Error("Live chat requires SimulatorLiveChatProvider");
  return value;
}

/** Owns the live feed for the game lifetime, independently of visible panels. */
function LiveChatSession({
  children,
  gameSlug,
  gameId,
  viewerId,
  initialMessages = [],
  initialFreeTextEnabled = false,
}: {
  readonly children: ReactNode;
  readonly gameSlug: EngineInteractionView["gameSlug"];
  readonly gameId: string;
  readonly viewerId: string;
  readonly initialMessages?: readonly unknown[];
  readonly initialFreeTextEnabled?: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    toUiMessages(initialMessages, viewerId),
  );
  const [freeTextEnabled, setFreeTextEnabled] = useState(initialFreeTextEnabled);
  useEffect(() => {
    const handle = acquireRootGatewayHandle(gameSlug);
    const unsubscribers = [
      handle.on("game_chat_history", (payload) => {
        if (payload.gameId !== gameId) return;
        setMessages(toUiMessages(payload.messages, viewerId));
        setFreeTextEnabled(payload.freeTextEnabled);
      }),
      handle.on("chat_message", (payload) => {
        if (payload.gameId !== gameId) return;
        const message = toUiMessage(payload.message, viewerId);
        if (!message) return;
        if (
          payload.message.kind === "system" &&
          payload.message.systemEvent === "free_text_chat_enabled"
        )
          setFreeTextEnabled(true);
        setMessages((current) =>
          current.some((entry) => entry.id === message.id)
            ? current
            : current.concat(message).slice(-100),
        );
      }),
    ];
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      handle.release();
    };
  }, [gameSlug, gameId, viewerId]);
  const sendPreset = (presetKey: string) => {
    const handle = acquireRootGatewayHandle(gameSlug);
    const key = CHAT_PRESET_KEYS.find((candidate) => candidate === presetKey);
    if (key) handle.emit("send_chat_message", { gameId, presetKey: key });
    handle.release();
  };
  const sendText = (text: string) => {
    const handle = acquireRootGatewayHandle(gameSlug);
    handle.emit("send_free_text_chat_message", { gameId, text });
    handle.release();
  };
  return (
    <LiveChatContext.Provider value={{ messages, freeTextEnabled, sendPreset, sendText }}>
      {children}
    </LiveChatContext.Provider>
  );
}

export function SimulatorLiveChatProvider(props: Parameters<typeof LiveChatSession>[0]) {
  return <LiveChatSession key={`${props.gameSlug}:${props.gameId}:${props.viewerId}`} {...props} />;
}
