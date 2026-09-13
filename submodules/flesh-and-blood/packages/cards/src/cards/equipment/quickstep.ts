import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/quickstep.generated.ts";

export const quickstep = defineCard(fabCardIdentitiesByCanonicalId["DmpnhzMR7WhCgkFWncRkk"], {
  abilities: {
    actionDestroyEachHeroCreatesQuickenTokenGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "create-token",
        token: "quicken",
        controller: "each",
      },
    },
  },
});
