import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gauntlet-of-might.generated.ts";

export const gauntletOfMight = defineCard(fabCardIdentitiesByCanonicalId["CHNL9gtPrf8NhTwLWjT6w"], {
  keywords: [bladeBreak],
  abilities: {
    actionDestroyCreateMightTokenGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "create-token",
        token: "might",
        controller: "controller",
      },
    },
  },
});
