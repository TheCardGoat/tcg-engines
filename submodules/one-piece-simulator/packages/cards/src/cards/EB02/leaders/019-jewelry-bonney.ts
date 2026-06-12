import type { LeaderCard } from "@tcg/op-types";
import { eb02JewelryBonney019I18n } from "./019-jewelry-bonney.i18n.ts";

export const eb02JewelryBonney019: LeaderCard = {
  id: "OP07-019",
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 5,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] 1 (You may rest the specified number of DON!! cards in your cost area.): Rest up to 1 of your opponent's Leader or Character cards.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
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
  i18n: eb02JewelryBonney019I18n,
};
