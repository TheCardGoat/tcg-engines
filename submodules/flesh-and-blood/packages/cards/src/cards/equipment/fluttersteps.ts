import { ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/fluttersteps.generated.ts";

export const fluttersteps = defineCard(fabCardIdentitiesByCanonicalId["PGmLNJTqFnRhJwBgdc698"], {
  keywords: [ward(1)],
  abilities: {
    whenIsDestroyedMayPlayNextAuraTurnAs: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "destroy",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "play-card",
            fromZones: ["hand"],
            source: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
            },
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
            },
            duration: "this-turn",
            asType: "instant",
          },
        },
      },
    },
  },
});
