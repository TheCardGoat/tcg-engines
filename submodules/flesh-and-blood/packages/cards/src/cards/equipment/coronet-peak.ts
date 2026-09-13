import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/coronet-peak.generated.ts";

export const coronetPeak = defineCard(fabCardIdentitiesByCanonicalId["9b7hjHNnGDBkfL8jL89bf"], {
  keywords: [bladeBreak],
  abilities: {
    actionTargetHeroDiscardsUnlessTheyPay: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 3,
      },
      effect: {
        type: "unless",
        effect: {
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["hand"],
            count: 1,
          },
        },
        escape: {
          type: "pay",
          cost: {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          payer: "opponent",
        },
      },
    },
  },
});
