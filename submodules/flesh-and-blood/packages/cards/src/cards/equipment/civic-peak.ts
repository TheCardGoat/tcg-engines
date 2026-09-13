import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/civic-peak.generated.ts";

export const civicPeak = defineCard(fabCardIdentitiesByCanonicalId["CjRzTWJcLTzzfkhwCRK7K"], {
  keywords: [temper],
  abilities: {
    wheneverDefendsAnotherTargetHeroDraws: {
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
          type: "draw",
          count: 1,
          player: "another-hero",
        },
      },
    },
  },
});
