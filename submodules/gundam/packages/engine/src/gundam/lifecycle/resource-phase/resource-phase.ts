import type { LifecycleContext } from "../../../types/index.ts";
import type { GundamG } from "../../types.ts";
import { canPlaceResource, isExResourceToken } from "../../moves/core/play-card-shared.ts";
import { logPhaseEntered } from "../../logging.ts";
import { emitGundamEvent } from "../../events.ts";
import { enqueueObserverTriggers } from "../../effects/pending-effects.ts";

export function resourcePhaseOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "resource-phase" });

  const turnPlayer = ctx.framework.state.status.turnPlayer as string | undefined;
  if (!turnPlayer) return;

  if (canPlaceResource(turnPlayer, false, ctx.framework)) {
    const resourceDeck = ctx.framework.zones.getCards({
      zone: "resourceDeck",
      playerId: turnPlayer,
    });
    if (resourceDeck.length > 0) {
      const before = ctx.framework.zones.getCards({
        zone: "resourceArea",
        playerId: turnPlayer,
      });
      ctx.framework.zones.drawCards({
        from: { zone: "resourceDeck", playerId: turnPlayer },
        to: { zone: "resourceArea", playerId: turnPlayer },
        count: 1,
      });
      // Check if the placed card is an EX resource token and fire the trigger.
      const after = ctx.framework.zones.getCards({
        zone: "resourceArea",
        playerId: turnPlayer,
      });
      const newCardId = after.find((id) => !before.includes(id));
      if (newCardId && isExResourceToken(newCardId, ctx.framework)) {
        const G = ctx.G as GundamG;
        const exEvent = {
          type: "exResourcePlaced" as const,
          cardId: newCardId,
          playerId: turnPlayer,
          ownerId: turnPlayer,
        };
        enqueueObserverTriggers(G, exEvent, ctx.framework, undefined);

        emitGundamEvent(ctx.framework.events, {
          kind: "EX_RESOURCE_PLACED",
          payload: { playerId: turnPlayer, cardId: newCardId },
        });
      }
    }
  }
}
