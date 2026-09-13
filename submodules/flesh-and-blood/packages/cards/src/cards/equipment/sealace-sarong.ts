import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/sealace-sarong.generated.ts";

export const sealaceSarong = defineCard(fabCardIdentitiesByCanonicalId["hqP98JGRBnqGr9QnPCmHC"], {
  keywords: [bladeBreak],
  abilities: {
    instantTurnBlueArrowArsenalFaceUpGetsGo: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "turn-face-up",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["arsenal"],
              filter: {
                color: ["blue"],
                typeBox: {
                  subtypes: ["Arrow"],
                },
                hasStatus: "face-down",
              },
              count: 1,
            },
            outputBinding: "it",
          },
        ],
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "binding",
          binding: "it",
        },
        duration: "this-turn",
      },
    },
  },
});
