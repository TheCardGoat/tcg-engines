import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/runebleed-robe.generated.ts";

/**
 * PEN094 Runebleed Robe — Runeblade Chest d0 Arcane Barrier 1.
 *
 * Printed:
 *   Instant - Destroy this and a Runechant you control: Prevent the next 1
 *   arcane damage that would be dealt to you this turn.
 *   Arcane Barrier 1
 *
 * Model notes (hand-authored):
 * - Destroy cost filter must use name: "Runechant" (token type-box is
 *   Token+Aura; subtypes:["Runechant"] never matches — Bloodsheath / Amethyst
 *   family).
 * - Mixed cost: destroy-self + destroy one controlled Runechant (activation
 *   destroyTargets path).
 * - Effect: shielding prevention 1 arcane this turn for controller.
 */
export const runebleedRobe = defineCard(fabCardIdentitiesByCanonicalId["7rQWjNgrPmCm9wJRNHdbG"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    instantDestroyRunechantControlPreventNext1ArcaneDamage: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "destroy-self",
          },
          {
            class: "effect",
            type: "destroy",
            filter: {
              name: "Runechant",
            },
          },
        ],
      },
      effect: {
        type: "prevention",
        preventionKind: "shielding",
        amount: 1,
        damageType: "arcane",
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  },
});
