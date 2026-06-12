import type { CharacterCard } from "@tcg/op-types";
import { op04King045I18n } from "./045-king.i18n.ts";

export const op04King045: CharacterCard = {
  id: "OP04-045",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP04",
  cost: 7,
  power: 8000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "slash",
  effect: "[On Play] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op04King045I18n,
};
