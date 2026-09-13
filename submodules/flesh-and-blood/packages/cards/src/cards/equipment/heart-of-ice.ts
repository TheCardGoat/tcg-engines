import { arcaneBarrier, bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heart-of-ice.generated.ts";

/**
 * ELE144 Heart of Ice — Ice Chest d1 Arcane Barrier 1 Blade Break.
 *
 * Printed:
 *   Once per Turn Action - {r}: Cards and activated abilities cost opposing
 *   heroes additional {r} this turn. Go again
 *   Arcane Barrier 1
 *   Blade Break
 *
 * Model notes (hand-authored):
 * - Prior model scanned opponent stack star — nothing is on the stack yet, and
 *   "this turn" needs multi-fire future cost increase on opponent plays/activates.
 * - appliesTo.next hasStatus "another" = objects controlled by someone other
 *   than the effect controller (1v1: the sole opponent).
 * - Engine must observe opponent announce/activate for future applicability and
 *   apply prospective cost deltas when the actor is not the CE controller.
 */
export const heartOfIce = defineCard(fabCardIdentitiesByCanonicalId["PpQBJwQCfFrHzKM9TkcbD"], {
  keywords: [arcaneBarrier(1), bladeBreak],
  abilities: {
    oncePerTurnActionActivatedAbilitiesCostOpposingHeroes: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            hasStatus: "another",
          },
          count: 32,
        },
      },
    },
  },
});
