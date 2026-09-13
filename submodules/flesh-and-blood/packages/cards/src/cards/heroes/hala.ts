import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/hala.generated.ts";

export const hala = defineCard(fabCardIdentitiesByCanonicalId["PCcMjhHfKKrmH8hR9LQBc"], {
  abilities: {
    actionResourceResourceResourceTapSharpenTargetSwordGoAgain: {
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
            type: "tap-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sharpen",
        target: {
          selector: "object",
          // Activated ability: choose the sword at resolution (not on-stack).
          declared: "at-resolution",
          player: "controller",
          zones: ["weapon", "permanent"],
          filter: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
          count: 1,
        },
        outputBinding: "it",
      },
    },
  },
});
