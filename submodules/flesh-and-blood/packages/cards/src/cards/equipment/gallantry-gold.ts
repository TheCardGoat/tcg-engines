import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gallantry-gold.generated.ts";

/**
 * BOL007 Gallantry Gold — Warrior Arms d1 Battleworn.
 *
 * Printed: Action - {r}, destroy Gallantry Gold: Your weapon attacks gain
 * +1{p} this turn. Go again. Battleworn
 *
 * Model notes (hand-authored):
 * - Prior model targeted combat-chain objects with subtypes:["Weapon"] +
 *   count:star at resolution. Two failures: (1) Weapon is FAB_TYPES not a
 *   subtype (dead filter — evo-engine-room / grains family); (2) at-resolution
 *   combat-chain does not float to later weapon attacks this turn.
 * - Remodel: appliesTo.next types:["Weapon"] + count:star floating aura
 *   (stubby-hammerers / continuousFutureApplicability Infinity path).
 */
export const gallantryGold = defineCard(fabCardIdentitiesByCanonicalId["rwLmwBWMRMnd9tzGBwng7"], {
  keywords: [battleworn],
  abilities: {
    actionDestroyGallantryGoldWeaponAttacksGain1Turn: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Weapon"],
            },
          },
          count: { type: "all" },
        },
      },
    },
  },
});
