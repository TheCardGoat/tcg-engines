import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/civic-steps.generated.ts";

export const civicSteps = defineCard(fabCardIdentitiesByCanonicalId["qQ9JC8BtngfRq7n9pqpKM"], {
  keywords: [temper],
  abilities: {
    wheneverDefendsCreateQuickenTokenUnderAnotherHeroS: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "quicken",
          controller: "another-hero",
        },
      },
    },
  },
});
