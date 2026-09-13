import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/carrion-crown.generated.ts";

export const carrionCrown = defineCard(fabCardIdentitiesByCanonicalId["pFgDCjG98QkNLjGpgB7PH"], {
  keywords: [bladeBreak],
  abilities: {
    actionDiscardAllyDestroyDrawGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "discard",
            count: 1,
            filter: {
              typeBox: {
                subtypes: ["Ally"],
              },
            },
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  },
});
