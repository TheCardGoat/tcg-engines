import type { EngineInteractionView } from "@tcg/protocol";
import { ActionAttentionReminder } from "./ActionAttentionReminder";
import { actionAttentionFromInteraction } from "./action-attention";
import { acquireRootGatewayHandle } from "../../lib/gateway/root-socket";

export function LiveActionAttention({
  view,
  viewerId,
  stateVersion,
  canAct,
  submitting = false,
  label,
  onShowAction,
  gameId,
}: {
  readonly view: EngineInteractionView | null | undefined;
  readonly viewerId: string | null | undefined;
  readonly stateVersion: number | null | undefined;
  readonly canAct: boolean;
  readonly submitting?: boolean;
  readonly label?: string;
  readonly onShowAction?: () => void;
  readonly gameId?: string;
}) {
  const decision = actionAttentionFromInteraction({
    view,
    viewerId,
    stateVersion,
    canAct,
    submitting,
    label,
  });
  return (
    <ActionAttentionReminder
      decision={decision}
      onShowAction={onShowAction}
      onThinking={
        gameId && view
          ? () => {
              const handle = acquireRootGatewayHandle(view.gameSlug);
              handle.emit("send_chat_message", { gameId, presetKey: "thinking" });
              handle.release();
            }
          : undefined
      }
    />
  );
}
