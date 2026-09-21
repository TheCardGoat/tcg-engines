import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heart-throb.generated.ts";

export const heartThrob = defineCard(fabCardIdentitiesByCanonicalId["h7NLHrBf7dNmKLN8zqRLn"], {
  abilities: {
    actionDestroyEachHeroCreatesVigorTokenGoAgain: {
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
        creator: "token-controller",
        controller: "each",
      },
    },
  },
});
