import type { FabMatchState } from "../../../state.ts";
import type { ProposedEvent } from "../../events.ts";
import type { FabEventReduction } from "../../../kernel/transaction-kernel.ts";
import { assertNeverZoneMove, type ZoneMoveEventName } from "./helpers.ts";
import { reducePlayEquip } from "./play-equip.ts";
import { reduceMove } from "./move.ts";
import { reduceDrawDiscard } from "./draw-discard.ts";
import { reduceCreateSearch } from "./create-search.ts";

export type { ZoneMoveEventName } from "./helpers.ts";

type ZoneMoveEvent = Extract<ProposedEvent, { name: ZoneMoveEventName }>;

/** Exhaustive zone-move reduction dispatcher. */
export function reduceZoneMoveEvent(
  state: FabMatchState,
  event: ZoneMoveEvent,
): FabEventReduction | null {
  switch (event.name) {
    case "announce-card":
    case "play":
    case "equip":
      return reducePlayEquip(state, event);
    case "move-zone":
    case "enter-arena":
    case "leave-arena":
    case "enter-or-leave-arena":
    case "put-into-graveyard":
    case "banish":
    case "destroy":
    case "dies":
      return reduceMove(state, event);
    case "discard":
    case "draw":
    case "reveal":
    case "look":
    case "opt":
      return reduceDrawDiscard(state, event);
    case "create":
    case "search":
    case "shuffle-zone":
    case "random-token-request":
    case "roll-request":
      return reduceCreateSearch(state, event);
    default:
      return assertNeverZoneMove(event);
  }
}
