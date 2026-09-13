import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/misfire-dampener.generated.ts";

/**
 * HNT250 Misfire Dampener — Mechanologist Arms d1 Blade Break.
 *
 * Printed:
 *   Instant - Destroy this: Prevent the next 1 arcane damage that would be
 *   dealt to you this turn. If you've boosted this turn, instead prevent the
 *   next 2.
 *   Blade Break
 *
 * Model notes (hand-authored; case-by-case; PEN043 templar-spellbane twin):
 * - Prior sequence prevent-1 then conditional instead prevent-2 stacked both
 *   (proposal ignores instead:true on sequence steps).
 * - Remodel: single conditional then/else prevention (boosted → 2, else 1).
 * - Both branches need damageType:"arcane" (boosted branch previously omitted).
 */
export const misfireDampener = defineCard(fabCardIdentitiesByCanonicalId["bCqKMLLRmjkM7K9TPKrNb"], {
  keywords: [bladeBreak],
  abilities: {
    instantDestroyPreventNext1ArcaneDamageWouldBe: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "conditional",
        condition: { type: "performed-this-turn", event: "boost", player: "controller" },
        then: {
          type: "prevention",
          preventionKind: "fixed",
          amount: 2,
          damageType: "arcane",
          shielded: {
            selector: "controller",
          },
          duration: "this-turn",
        },
        else: {
          type: "prevention",
          preventionKind: "fixed",
          amount: 1,
          damageType: "arcane",
          shielded: {
            selector: "controller",
          },
          duration: "this-turn",
        },
      },
    },
  },
});
