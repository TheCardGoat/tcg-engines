import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/vigor-girth.generated.ts";

export const vigorGirth = defineCard(fabCardIdentitiesByCanonicalId["GpQBzCwwRFCKjWNq8Hgtj"], {
  keywords: [bladeBreak],
  abilities: {
    actionDestroyCreateVigorTokenGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "create-token",
        token: "vigor",
        controller: "controller",
      },
    },
  },
});
