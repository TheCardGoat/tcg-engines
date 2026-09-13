import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amulet-of-echoes.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const amuletOfEchoes = definePitchFamily(fabPitchFamilies["amulet-of-echoes"], {
  keywords: [goAgain],
  abilities: () => ({
    instantDestroyAmuletEchoesTargetHeroDiscards2Activate: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "cards-played-this-turn",
          player: "opponent",
          groupBy: "name",
        },
        comparison: {
          op: "gte",
          value: 2,
        },
      },
      effect: {
        type: "discard",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "opponent",
          zones: ["hand"],
          count: 2,
        },
      },
    },
  }),
});
export const { blue: amuletOfEchoesBlue } = amuletOfEchoes.cards;
