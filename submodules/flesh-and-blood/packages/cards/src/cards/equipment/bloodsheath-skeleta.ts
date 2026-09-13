import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bloodsheath-skeleta.generated.ts";

/**
 * CRU141 Bloodsheath Skeleta — Runeblade Chest d2 Temper.
 *
 * Printed: Instant - Destroy this: The next attack action card and non-attack
 * action card you play this turn get "This card costs {r} less to play for
 * each Runechant you control." Temper
 *
 * Model notes (hand-authored):
 * - Two independent appliesTo.next cost grants (AAC + non-attack Action), not
 *   a single and-filter of English residue (Card/And/Non-attack subtypes).
 * - Runechant count uses name filter (token type-box is Token+Aura, not
 *   subtypes:Runechant) — same as Amethyst Tiara.
 * - Functional form is direct cost −count on next card (Amplify the Arknight
 *   family), equivalent to granting the continuous ability text.
 */
const runechantCostLess = {
  type: "modify-numeric" as const,
  property: "cost" as const,
  op: "subtract" as const,
  amount: {
    type: "count" as const,
    what: "cards-in-zone" as const,
    zone: "permanent" as const,
    player: "controller" as const,
    filter: { name: "Runechant" },
  },
  target: { selector: "this-attack" as const },
  duration: "this-turn" as const,
};

export const bloodsheathSkeleta = defineCard(
  fabCardIdentitiesByCanonicalId["nGHhHDgKmGgb7gjwWjHJF"],
  {
    keywords: [temper],
    abilities: {
      instantDestroyNextAttackActionNonAttackActionPlay: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              ...runechantCostLess,
              appliesTo: nextAttackActionLatch(),
            },
            {
              ...runechantCostLess,
              appliesTo: {
                next: {
                  typeBox: {
                    types: ["Action"],
                    excludeSubtypes: ["Attack"],
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
);
