import type { CharacterCard } from "@tcg/op-types";
import { op13JewelryBonney108I18n } from "./108-jewelry-bonney.i18n.ts";

export const op13JewelryBonney108: CharacterCard = {
  id: "OP13-108",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP13",
  cost: 9,
  power: 10000,
  trigger:
    "If you have 1 or less Life cards, rest up to 1 of your opponent's Characters with a cost of 7 or less.",
  traits: ["Bonney Pirates Egghead"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-108_p1_L2qVa00.jpg",
      imageId: "OP13-108_p1",
    },
  ],
  effect:
    '[On Play] If your Leader has the "Egghead" type, this Character gains [Rush] during this turn. Then, your opponent adds 1 card from the top of their Life cards to their hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Egghead",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
      },
    ],
  },
  i18n: op13JewelryBonney108I18n,
};
