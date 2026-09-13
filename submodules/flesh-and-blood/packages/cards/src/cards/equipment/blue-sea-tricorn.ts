import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blue-sea-tricorn.generated.ts";

export const blueSeaTricorn = defineCard(fabCardIdentitiesByCanonicalId["8TbK6kFJcDtRjqwNzBbmp"], {
  keywords: [bladeBreak],
  abilities: {
    actionDestroyDrawGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 3,
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
