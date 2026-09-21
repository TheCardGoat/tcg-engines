import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/fiddle-dee.generated.ts";

export const fiddleDee = defineCard(fabCardIdentitiesByCanonicalId["p7CLrzj7kGMtt8cLfMdqT"], {
  abilities: {
    actionDestroyEachHeroCreatesMightTokenGoAgain: {
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
        creator: "token-controller",
        controller: "each",
      },
    },
  },
});
