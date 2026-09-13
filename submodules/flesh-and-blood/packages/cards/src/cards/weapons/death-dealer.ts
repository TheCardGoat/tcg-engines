import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/death-dealer.generated.ts";

export const deathDealer = defineCard(fabCardIdentitiesByCanonicalId["Nnmtz6GrR6MWMcptb6wD7"], {
  abilities: {
    oncePerTurnActionResourceNoArsenalPutArrowHandFaceUpArsenalDrawGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "arsenal",
          player: "controller",
          comparison: {
            op: "eq",
            value: 0,
          },
        },
        then: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                typeBox: {
                  subtypes: ["Arrow"],
                },
              },
              count: 1,
            },
            to: {
              zone: "arsenal",
              visibility: "face-up",
            },
            outputBinding: "it",
          },
          then: {
            type: "draw",
            count: 1,
            player: "controller",
          },
        },
      },
    },
  },
});
