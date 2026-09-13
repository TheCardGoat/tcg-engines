import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/flowshard-elemental.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const flowshardElemental = definePitchFamily(fabPitchFamilies["flowshard-elemental"], {
  keywords: [goAgain],
  abilities: () => ({
    whenAttacksMayDiscardInstantIfDoCreateLightning: {
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
          type: "optional",
          effect: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                typeBox: {
                  types: ["Instant"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "create-token",
                token: "lightning-flow",
                controller: "controller",
              },
              {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: goAgain,
                },
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            ],
          },
        },
      },
    },
  }),
});
export const { red: flowshardElementalRed } = flowshardElemental.cards;
