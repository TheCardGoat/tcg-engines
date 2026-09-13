import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/grandeur-of-valahai.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const grandeurOfValahaiBlue = defineCard(
  fabCardIdentitiesByCanonicalId.pwfB8pHmJRDD8CfP8mTbr,
  {
    keywords: [legendary],
    abilities: {
      createSeismicSurgeOnPitch: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "pitch",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "pitched-card",
              relationship: {
                kind: "any",
              },
              filter: {
                name: "Grandeur Of Valahai",
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "seismic-surge",
            controller: "controller",
          },
        },
      },
    },
  },
);
