import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/heart-of-fyendal.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const heartOfFyendalBlue = defineCard(fabCardIdentitiesByCanonicalId.pBpLPQ7kg6mkBpNMMPdCD, {
  keywords: [legendary],
  abilities: {
    gainLifeWhenBehindOnPitch: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
              name: "Heart Of Fyendal",
            },
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "lt",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-life",
          amount: 1,
          target: {
            selector: "controller",
          },
        },
      },
    },
  },
});
