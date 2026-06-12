import type { LeaderCard } from "@tcg/op-types";
import { op07JewelryBonney019I18n } from "./019-jewelry-bonney.i18n.ts";

export const op07JewelryBonney019: LeaderCard = {
  id: "OP07-019",
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP07",
  power: 5000,
  life: 5,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-019_p1.jpg",
      imageId: "OP07-019_p1",
    },
  ],
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] (1) (You may rest the specified number of DON!! cards in your cost area.): Rest up to 1 of your opponent's Leader or Character cards.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07JewelryBonney019I18n,
};
