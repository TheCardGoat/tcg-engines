import type { CharacterCard } from "@tcg/op-types";
import { op10TonyTonyChopper087I18n } from "./087-tony-tony-chopper.i18n.ts";

export const op10TonyTonyChopper087: CharacterCard = {
  id: "OP10-087",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Animal Straw Hat Crew Dressrosa"],
  attribute: "strike",
  effect:
    '[Activate: Main] You may rest this Character and 1 of your "Dressrosa" type Leader or Stage cards: If your opponent has 5 or more cards in their hand, your opponent trashes 1 card from their hand. Then, trash 2 cards from the top of your deck.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 5,
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10TonyTonyChopper087I18n,
};
