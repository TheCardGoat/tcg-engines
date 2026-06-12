import type { CharacterCard } from "@tcg/op-types";
import { op07Morgans090I18n } from "./090-morgans.i18n.ts";

export const op07Morgans090: CharacterCard = {
  id: "OP07-090",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Journalist"],
  attribute: "wisdom",
  effect:
    "[On Play] Your opponent trashes 1 card from their hand and reveals their hand. Then, your opponent draws 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op07Morgans090I18n,
};
