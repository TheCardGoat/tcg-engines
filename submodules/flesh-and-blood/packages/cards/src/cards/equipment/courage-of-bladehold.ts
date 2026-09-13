import { goAgain, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/courage-of-bladehold.generated.ts";

/**
 * CRU081 Courage of Bladehold — Warrior Chest d2 Temper.
 *
 * Printed: Action - Destroy Courage of Bladehold: Your sword attacks cost
 * {r} less this turn. Go again. Temper
 *
 * Model notes (hand-authored):
 * - Prior model scanned hand/stack star for Sword — swords are equipped
 *   weapons, not hand cards, and "this turn" needs multi-fire future
 *   applicability (Savage Sash / Kassai family).
 * - types:["Sword"] type-line match (Sword is subtype on type-boxes).
 */
export const courageOfBladehold = defineCard(
  fabCardIdentitiesByCanonicalId["cH7LdkrKdFnjP7PLwFDhD"],
  {
    keywords: [temper],
    abilities: {
      actionDestroyCourageBladeholdSwordAttacksCostLessTurn: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "modify-activation-cost",
          op: "subtract",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Sword"],
              },
            },
            count: 32,
          },
        },
      },
    },
  },
);
