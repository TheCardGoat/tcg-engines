import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/rally-the-underdog.generated.ts";

export const rallyTheUnderdog = defineCard(fabCardIdentitiesByCanonicalId.hRRgnn9nCqGDpqQNHhwJm, {
  abilities: {
    drawBasedOnLife: {
      kind: "resolution",
      effect: {
        type: "conditional",
        condition: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "lt",
        },
        then: {
          type: "draw",
          count: 2,
          player: "controller",
        },
        else: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  },
});
