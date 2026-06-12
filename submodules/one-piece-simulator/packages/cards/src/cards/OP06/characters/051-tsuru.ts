import type { CharacterCard } from "@tcg/op-types";
import { op06Tsuru051I18n } from "./051-tsuru.i18n.ts";

export const op06Tsuru051: CharacterCard = {
  id: "OP06-051",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP06",
  cost: 5,
  power: 4000,
  counter: 4000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[On Play] You may trash 2 cards from your hand: Your opponent returns 1 of their Characters to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
              },
              chosenBy: "opponent",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06Tsuru051I18n,
};
