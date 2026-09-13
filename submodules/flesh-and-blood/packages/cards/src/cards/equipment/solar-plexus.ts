import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/solar-plexus.generated.ts";

/**
 * ASB004 Solar Plexus — Light Chest (no printed defense).
 *
 * Printed: Instant - Destroy this, banish a card from your soul: Yellow cards
 * cost you {r} less to play this turn.
 *
 * Model notes (hand-authored):
 * - Instant mixed destroy-self + banish from soul (count 1).
 * - Cost reduction is multi-fire this turn for yellow cards — not a hand star
 *   snapshot (same appliesTo family as AKO004 Savage Sash).
 */
export const solarPlexus = defineCard(fabCardIdentitiesByCanonicalId["GJbRTN6kqNnDtGWzTkdPT"], {
  abilities: {
    instantDestroyBanishFromSoulYellowCostLessPlay: {
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
            type: "banish",
            from: "soul",
            count: 1,
          },
        ],
      },
      // Printed: "Yellow cards cost you {r} less to play this turn" — multi-fire
      // future-object cost reduction (not a hand star snapshot).
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            color: ["yellow"],
          },
          count: 32,
        },
      },
    },
  },
});
