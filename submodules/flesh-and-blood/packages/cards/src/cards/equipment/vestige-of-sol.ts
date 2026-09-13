import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/vestige-of-sol.generated.ts";

/**
 * MON060 Vestige of Sol — Light Chest d1 Blade Break.
 *
 * Printed:
 *   If a card has been put into your hero's soul this turn, whenever you
 *   pitch a Light card, instead gain that many {r} plus 1.
 *   Blade Break
 *
 * Model notes (hand-authored):
 * - Gate: has-status card-put-into-soul-this-turn (turn fact on soul put).
 * - "instead gain that many {r} plus 1" is a pitch replacement that adds 1
 *   to resourcesGenerated (not a delayed-trigger that would double-dip).
 * - Pitch filter uses types:["Light"] (talent type-line), not name "A Light
 *   Card" (parser residue that never matched).
 * - Blade Break d1 independent of the pitch path.
 */
export const vestigeOfSol = defineCard(fabCardIdentitiesByCanonicalId["PTjbDJpDMHwR6TdJkBLtr"], {
  keywords: [bladeBreak],
  abilities: {
    ifHasBeenPutIntoHeroSSoulTurn: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "performed-this-turn", event: "put-card-into-soul", player: "controller" },
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "pitch",
          filter: {
            typeBox: {
              supertypes: ["Light"],
            },
          },
        },
        // Additive +1 on the pitch event's resourcesGenerated ("that many plus 1").
        modification: {
          type: "gain-resources",
          amount: 1,
        },
        duration: "while-in-arena",
      },
    },
  },
});
