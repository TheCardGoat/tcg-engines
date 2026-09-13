import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/confidence.generated.ts";
import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";

export const confidence = defineCard(fabCardIdentitiesByCanonicalId.WBFjTCfmbwHCr8WNmz8RQ, {
  abilities: {
    limitDefenseAtStartOfTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
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
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "defend",
              maxDefenders: {
                count: 2,
                filter: {
                  // CR 8.1.12 "Block" is a card type; a "non-block card" is one NOT
                  // of type Block (NOT "a card with no {d}"). Action cards that have
                  // a block value are still non-block and count toward the cap.
                  typeBox: {
                    excludeTypes: ["Block"],
                  },
                },
              },
              duration: "this-turn",
              appliesTo: nextAttackActionLatch(),
            },
          ],
        },
      },
    },
  },
});
