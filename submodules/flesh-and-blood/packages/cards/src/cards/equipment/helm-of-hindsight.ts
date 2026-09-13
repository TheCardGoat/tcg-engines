import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/helm-of-hindsight.generated.ts";

export const helmOfHindsight = defineCard(fabCardIdentitiesByCanonicalId["HKqcfqWBCP9T6CHdQRCtn"], {
  abilities: {
    instantDestroyPutTargetAttackActionFromGraveyardTop: {
      kind: "activated",
      abilityType: "instant",
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
          filter: attackActionFilter(),
          count: 1,
        },
        to: {
          zone: "deck",
          position: "top",
        },
      },
    },
  },
});
