import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ornate-tessen.generated.ts";

export const ornateTessen = defineCard(fabCardIdentitiesByCanonicalId["JwhRzNPr9KNpMHzP8kWNG"], {
  abilities: {
    instantDestroyOrnateTessenPutFromHandBottomDeck: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "if-you-do",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            filter: {},
            count: 1,
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
        then: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  },
});
