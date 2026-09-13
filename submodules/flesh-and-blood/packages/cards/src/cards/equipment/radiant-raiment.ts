import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/radiant-raiment.generated.ts";

/**
 * DTD076 Radiant Raiment — Light Chest (no printed defense).
 *
 * Printed:
 *   Instant - Banish this and a card from your hero's soul: Prevent the next
 *   2 damage that would be dealt to your hero this turn.
 *
 * Model notes (hand-authored, sibling of DTD075 Radiant View):
 * - "Banish this" is banish-self (not banish any arena permanent).
 * - Plus banish one soul card as a second cost.
 * - Prevention fixed 2, shielded controller, this-turn.
 */
export const radiantRaiment = defineCard(fabCardIdentitiesByCanonicalId["gmKLgjmBKHDRjnCf7Q7kh"], {
  abilities: {
    instantBanishFromHeroSSoulPreventNext2: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "banish-self",
          },
          {
            class: "effect",
            type: "banish",
            from: "soul",
            count: 1,
          },
        ],
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 2,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  },
});
