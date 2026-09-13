import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/fool-s-gold.generated.ts";

export const foolSGoldYellow = defineCard(fabCardIdentitiesByCanonicalId.t9FQnwWKw7RWz7pPBGf7f, {
  abilities: {
    createGoldOnDiscard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "discard",
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
});
