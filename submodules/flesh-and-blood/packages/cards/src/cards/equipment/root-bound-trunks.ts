import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/root-bound-trunks.generated.ts";

export const rootBoundTrunks = defineCard(fabCardIdentitiesByCanonicalId["jnM9JWHGJqdtjPmLCbGMm"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsTogetherAuraCreateEmbodimentEarthToken: {
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
          cohort: {
            kind: "together-with",
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "embodiment-of-earth",
          controller: "controller",
        },
      },
    },
  },
});
