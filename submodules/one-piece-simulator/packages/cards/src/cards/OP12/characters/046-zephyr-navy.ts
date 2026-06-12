import type { CharacterCard } from "@tcg/op-types";
import { op12ZephyrNavy046I18n } from "./046-zephyr-navy.i18n.ts";

export const op12ZephyrNavy046: CharacterCard = {
  id: "OP12-046",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP12",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["FILM Navy"],
  attribute: "strike",
  effect:
    "[On Play] Trash 2 cards from your hand.\n[Activate: Main] You may trash this Character: Return up to 1 Character with a cost of 5 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
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
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12ZephyrNavy046I18n,
};
