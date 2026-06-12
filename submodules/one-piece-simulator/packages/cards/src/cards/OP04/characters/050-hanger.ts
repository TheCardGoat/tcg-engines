import type { CharacterCard } from "@tcg/op-types";
import { op04Hanger050I18n } from "./050-hanger.i18n.ts";

export const op04Hanger050: CharacterCard = {
  id: "OP04-050",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may trash 1 card from your hand and rest this Character: Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Hanger050I18n,
};
