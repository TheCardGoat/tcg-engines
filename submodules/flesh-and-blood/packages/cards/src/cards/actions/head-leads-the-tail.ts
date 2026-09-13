import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/head-leads-the-tail.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const headLeadsTheTail = definePitchFamily(fabPitchFamilies["head-leads-the-tail"], {
  keywords: [goAgain],
  abilities: () => ({
    attacksNameAnotherAttackActionName1PowerCombatChain: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "name-card",
              restriction: "another-card",
              suggestions: ["your-hand", "combat-chain"],
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "any",
                zones: ["combat-chain", "stack"],
                filter: attackActionFilter({ name: "chosen" }),
                count: {
                  type: "all",
                },
              },
              duration: "this-combat-chain",
            },
          ],
        },
      },
    },
  }),
});

export const { red: headLeadsTheTailRed } = headLeadsTheTail.cards;
