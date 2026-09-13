import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/soul-food.generated.ts";

export const soulFood = definePitchFamily(fabPitchFamilies["soul-food"], {
  abilities: () => ({
    putSoulFoodAllInHandIntoHeroSSoul: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "self",
            },
            to: {
              zone: "soul",
            },
          },
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: {
                type: "all",
              },
            },
            to: {
              zone: "soul",
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: soulFoodYellow } = soulFood.cards;
