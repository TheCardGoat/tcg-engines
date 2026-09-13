import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/potion-of-luck.generated.ts";

export const potionOfLuck = definePitchFamily(fabPitchFamilies["potion-of-luck"], {
  abilities: () => ({
    instantDestroyPotionLuckShuffleHandArsenalDeckThenDrawMany: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand", "arsenal"],
                  count: {
                    type: "all",
                  },
                },
                to: {
                  zone: "deck",
                  shuffle: true,
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
            ],
          },
          {
            type: "draw",
            count: {
              type: "count",
              what: "put-on-bottom-this-way",
            },
            player: "controller",
          },
        ],
      },
    },
  }),
});

export const { blue: potionOfLuckBlue } = potionOfLuck.cards;
