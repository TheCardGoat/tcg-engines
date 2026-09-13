import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/quiver-of-abyssal-depths.generated.ts";

export const quiverOfAbyssalDepths = defineCard(
  fabCardIdentitiesByCanonicalId["FcJ9DMBN6LLbBJGhJ9Kkt"],
  {
    abilities: {
      instantDestroyQuiverAbyssalDepthsShuffleUp3Arrows: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard"],
                filter: {
                  typeBox: {
                    subtypes: ["Arrow"],
                  },
                  differentNames: true,
                },
                count: { type: "up-to", amount: 3 },
              },
              to: {
                zone: "deck",
              },
            },
            {
              type: "shuffle",
              zone: "deck",
            },
          ],
        },
      },
    },
  },
);
