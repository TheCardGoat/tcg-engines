import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { arcaneBarrier, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/tide-flippers.generated.ts";

export const tideFlippers = defineCard(fabCardIdentitiesByCanonicalId["TDJfbQjqKCwLRT7RczDrM"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    attackReactionDestroyTideFlippersTargetAttackAction2: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: attackActionFilter({
            numeric: [
              {
                property: "power",
                basis: "base",
                comparison: { op: "lte", value: 2 },
              },
            ],
          }),
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  },
});
