import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/torc-of-vim.generated.ts";

/**
 * ARR004 Torc of Vim — Brute Chest d1 Battleworn.
 *
 * Printed: Whenever you beat chest, you may destroy this. If you do, the next
 * Brute attack action card you play this turn costs {r}{r} less to play.
 * Battleworn
 *
 * Model notes (hand-authored):
 * - beat-chest trigger (controller) → optional destroy self → then cost −2
 *   this-turn appliesTo.next Brute Action Attack (one shot).
 * - Action is a CR type, not a subtype — prior and: subtypes Attack + subtypes
 *   Action never matched type-boxes (same family as Attack Reaction residue).
 */
export const torcOfVim = defineCard(fabCardIdentitiesByCanonicalId["pwjrCwDQn9Tb7MgRRRnGf"], {
  keywords: [battleworn],
  abilities: {
    wheneverBeatChestMayDestroyIfDoNextBrute: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "beat-chest",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
          then: {
            type: "modify-numeric",
            property: "cost",
            op: "subtract",
            amount: 2,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  supertypes: ["Brute"],
                  types: ["Action"],
                  subtypes: ["Attack"],
                },
              },
            },
          },
        },
      },
    },
  },
});
