import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/soul-of-existence-purple.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const soulOfExistencePurple = defineCard(
  fabCardIdentitiesByCanonicalId.d8hLNTfQcKDtKNrWDm7dF,
  {
    keywords: [legendary],
    abilities: {
      loseLifeOnPitch: {
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
            type: "lose-life",
            amount: 1,
            target: {
              selector: "controller",
            },
          },
        },
      },
    },
  },
);
