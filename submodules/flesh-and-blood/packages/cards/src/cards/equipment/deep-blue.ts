import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/deep-blue.generated.ts";

export const deepBlue = defineCard(fabCardIdentitiesByCanonicalId["wKhBB6Nb9RPQJ8zPFnpgJ"], {
  abilities: {
    actionPutFromHandBottomDeckDestroyDeepBlue: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "move-to-deck",
            from: "hand",
            position: "bottom",
            count: 1,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "gain-resources",
        amount: 3,
      },
    },
  },
});
