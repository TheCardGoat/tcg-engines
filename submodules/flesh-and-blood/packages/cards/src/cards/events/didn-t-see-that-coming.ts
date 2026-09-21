import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/didn-t-see-that-coming.generated.ts";

export const didnTSeeThatComing = defineCard(fabCardIdentitiesByCanonicalId.JgNNMtHdhBt6qJFPd8NDR, {
  abilities: {
    makeHealthierHeroesDiscard: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "for-each",
        target: {
          selector: "each-hero",
        },
        effect: {
          type: "conditional",
          condition: {
            type: "life-comparison",
            player: "iteration-subject",
            vs: "controller",
            op: "gt",
          },
          then: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "iteration-subject",
              zones: ["hand"],
              count: 1,
            },
          },
        },
      },
    },
  },
});
