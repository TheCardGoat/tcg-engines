import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/riches-of-tr-pal-dhani.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const richesOfTrPalDhaniYellow = defineCard(
  fabCardIdentitiesByCanonicalId.TwgRkcgHd9bW9Fb8JjwdF,
  {
    keywords: [legendary],
    abilities: {
      createGoldOnPitch: {
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
            token: "gold",
            controller: "controller",
          },
        },
      },
    },
  },
);
