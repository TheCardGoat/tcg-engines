import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/beckoning-haunt.generated.ts";

export const beckoningHaunt = defineCard(fabCardIdentitiesByCanonicalId["KrfHMt9FRGmFqPrRqRrfL"], {
  keywords: [guardwell],
  abilities: {
    actionDestroyReturnTargetAuraCostXFromGraveyard: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: {
              type: "x",
              count: 2,
              plus: 1,
            },
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["graveyard"],
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
            cost: {
              op: "eq",
              value: {
                type: "x",
              },
            },
          },
          count: 1,
        },
        to: {
          zone: "hand",
        },
      },
    },
  },
});
