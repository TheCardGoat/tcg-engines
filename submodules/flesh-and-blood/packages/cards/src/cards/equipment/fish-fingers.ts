import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/fish-fingers.generated.ts";

export const fishFingers = defineCard(fabCardIdentitiesByCanonicalId["KGqmhqzwPDDcr6MNr76gB"], {
  keywords: [bladeBreak],
  abilities: {
    actionDestroyNextAttackTurnGets1GoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  },
});
