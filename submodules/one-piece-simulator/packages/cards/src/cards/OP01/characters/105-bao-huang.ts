import type { CharacterCard } from "@tcg/op-types";
import { op01BaoHuang105I18n } from "./105-bao-huang.i18n.ts";

export const op01BaoHuang105: CharacterCard = {
  id: "OP01-105",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "wisdom",
  effect: "[On Play] Choose 2 cards from your opponent's hand; your opponent reveals those cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "revealFromHand",
            player: "opponent",
            amount: 2,
            chosenBy: "self",
          },
        ],
      },
    ],
  },
  i18n: op01BaoHuang105I18n,
};
