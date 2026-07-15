import type { FrameworkWriteAPI } from "../../../../types/move-types.ts";
import type { GundamG } from "../../../types.ts";
import {
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "../../../effects/pending-effects.ts";

/**
 * Publish the event used by effects that watch a Unit's damage destroy an
 * enemy shield-area card.
 *
 * The historical runtime event/timing names say "ByBattle", but the printed
 * contract also includes damage dealt by that Unit's <Breach> effect. Keeping
 * both combat paths on this helper gives observers the same source Unit and
 * controller context without enqueueing the destroyed Shield's 【Burst】 twice.
 */
export function enqueueShieldAreaCardDestroyedByUnitDamageTrigger(
  g: GundamG,
  sourceUnitId: string,
  destroyedCardId: string,
  sourcePlayerId: string,
  defenderPlayerId: string,
  framework: FrameworkWriteAPI,
): void {
  const event = {
    type: "shieldAreaCardDestroyedByBattle" as const,
    cardId: sourceUnitId,
    destroyedCardId,
    ownerId: sourcePlayerId,
    playerId: sourcePlayerId,
    defenderPlayerId,
  };
  enqueueOwnCardTriggers(g, event, sourceUnitId, sourcePlayerId, framework);
  enqueueObserverTriggers(g, event, framework, sourceUnitId);
}
