import type { CharacterCard } from "@tcg/op-types";
import { op12Sabo100I18n } from "./100-sabo.i18n.ts";

export const op12Sabo100: CharacterCard = {
  id: "OP12-100",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP12",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  effect:
    "If you have 3 or less Life cards, this Character gains [Blocker] and +3 cost.\n[On Play] You may add 1 card from the top of your Life cards to your hand: Draw 2 cards and trash 1 card from your hand.",
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
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12Sabo100I18n,
};
