import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/civic-guide.generated.ts";

export const civicGuide = defineCard(fabCardIdentitiesByCanonicalId["zFTw6RPr76Gc7cqPMFBzz"], {
  keywords: [temper],
  abilities: {
    wheneverDefendsCreateMightTokenUnderAnotherHeroS: {
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
          token: "might",
          controller: "another-hero",
        },
      },
    },
  },
});
