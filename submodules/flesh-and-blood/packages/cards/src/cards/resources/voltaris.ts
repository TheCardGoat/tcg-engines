import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/voltaris.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const voltarisBlue = defineCard(fabCardIdentitiesByCanonicalId.NwMtf6bWr68tRnfzzgzmt, {
  keywords: [legendary],
  abilities: {
    createLightningFlowOnPitch: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "lightning-flow",
          controller: "controller",
        },
      },
    },
  },
});
