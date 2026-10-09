import { CHAT_PRESET_KEYS, CHAT_PRESETS } from "@tcg/simulator-runtime/chat";
import { ChatPanel } from "@tcg/simulator-ui";
import { useSimulatorLiveChat } from "../providers/live-chat-context";

/** Presentation only; the match provider owns history and socket subscriptions. */
export function LiveMatchChatPanel({ canSend = true }: { canSend?: boolean }) {
  const { messages, freeTextEnabled, sendPreset, sendText } = useSimulatorLiveChat();
  return (
    <ChatPanel
      canSend={canSend}
      messages={messages}
      presets={CHAT_PRESET_KEYS.map((id) => ({ id, label: CHAT_PRESETS[id] }))}
      freeTextEnabled={freeTextEnabled}
      onSendPreset={sendPreset}
      onSendText={sendText}
      compact
    />
  );
}
