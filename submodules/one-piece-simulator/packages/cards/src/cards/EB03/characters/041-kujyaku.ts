import type { CharacterCard } from "@tcg/op-types";
import { eb03Kujyaku041I18n } from "./041-kujyaku.i18n.ts";

export const eb03Kujyaku041: CharacterCard = {
  id: "EB03-041",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB03",
  cost: 4,
  power: 6000,
  traits: ["Navy SWORD"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-041_p1_oQw07n5.jpg",
      imageId: "EB03-041_p1",
    },
  ],
  effect:
    "[Opponent's Turn] All of your {SWORD} type Characters with a cost of 6 or less gain +2000 power.\n[On Play] You may trash 1 {Navy} type card from your hand: Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "SWORD",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb03Kujyaku041I18n,
};
