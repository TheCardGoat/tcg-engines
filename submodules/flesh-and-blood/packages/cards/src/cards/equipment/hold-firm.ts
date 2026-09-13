import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hold-firm.generated.ts";

export const holdFirm = defineCard(fabCardIdentitiesByCanonicalId["6cfpHFn7czfqJDTRhw7fp"], {
  keywords: [bladeBreak],
  abilities: {
    actionDestroyCreate3ToughnessTokensActivateOnlyIf: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      condition: {
        type: "life-comparison",
        player: "self",
        vs: "each-other-hero",
        op: "lt",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "create-token",
        token: "toughness",
        controller: "controller",
        count: 3,
      },
    },
  },
});
