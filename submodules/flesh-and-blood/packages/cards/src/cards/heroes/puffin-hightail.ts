import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/puffin-hightail.generated.ts";

export const puffinHightail = defineCard(fabCardIdentitiesByCanonicalId["DghbPmFhwLkT9whJJjL9f"], {
  abilities: {
    actionTapDestroyGoldCreateGoldenCogToken: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "destroy",
            filter: {
              name: "Gold",
            },
          },
        ],
      },
      effect: {
        type: "create-token",
        token: "golden-cog",
        controller: "controller",
      },
    },
    secondTimeCrankTurnDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "crank",
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
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
      limit: {
        count: 1,
        per: "turn",
        ordinals: [2],
      },
    },
  },
});
