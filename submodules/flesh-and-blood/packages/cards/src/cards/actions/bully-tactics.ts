import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bully-tactics.generated.ts";

export const bullyTactics = definePitchFamily(fabPitchFamilies["bully-tactics"], {
  abilities: () => ({
    whenAttacksHeroMayPayUpIntimidateThemMany: {
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "pay",
                cost: {
                  class: "asset",
                  type: "resources",
                  amount: {
                    type: "up-to",
                    amount: 3,
                  },
                },
                payer: "controller",
              },
            },
            {
              type: "repeat",
              effect: {
                type: "intimidate",
                target: "attack-target",
              },
              times: {
                type: "count",
                what: "resources-paid-this-way",
              },
            },
          ],
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});
export const { red: bullyTacticsRed } = bullyTactics.cards;
