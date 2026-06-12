import type { LifecycleContext } from "../../../types/index.ts";
import type { GundamG } from "../../types.ts";
import { logPhaseEntered } from "../../logging.ts";
import { enqueueOwnCardTriggers } from "../../effects/pending-effects.ts";

export function endStepOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "end-phase", step: "end-step" });

  const turnPlayer = ctx.framework.state.status.turnPlayer as string | undefined;
  if (!turnPlayer) return;

  const g = ctx.G as GundamG;
  const sourceIds = [
    ...ctx.framework.zones.getCards({ zone: "battleArea", playerId: turnPlayer }),
    ...ctx.framework.zones.getCards({ zone: "baseSection", playerId: turnPlayer }),
  ];
  for (const sourceId of sourceIds) {
    enqueueOwnCardTriggers(
      g,
      { type: "turnEnded", cardId: sourceId, ownerId: turnPlayer },
      sourceId,
      turnPlayer,
      ctx.framework,
    );
  }
}
