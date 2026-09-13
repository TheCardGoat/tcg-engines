import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blade-cuff.generated.ts";

export const bladeCuff = defineCard(fabCardIdentitiesByCanonicalId["wLNgpgF6DJHmgfFHMnnpK"], {
  keywords: [bladeBreak],
  abilities: {
    actionDestroyBladeCuffDaggersGain1TurnGo: {
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
              subtypes: ["Dagger"],
            },
          },
          count: { type: "all" },
        },
      },
    },
  },
});
