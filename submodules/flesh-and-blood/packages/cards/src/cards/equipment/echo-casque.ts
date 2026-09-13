import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/echo-casque.generated.ts";

export const echoCasque = defineCard(fabCardIdentitiesByCanonicalId["P8KtKdKjn8HN6rLmckJkP"], {
  keywords: [battleworn],
  abilities: {
    wheneverBeatChestMayDestroyIfDoDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "beat-chest",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "if-you-do",
            effect: {
              type: "pay",
              cost: {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              payer: "controller",
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "destroy",
                  target: {
                    selector: "self",
                  },
                },
                {
                  type: "draw",
                  count: 1,
                  player: "controller",
                },
              ],
            },
          },
        },
      },
    },
  },
});
