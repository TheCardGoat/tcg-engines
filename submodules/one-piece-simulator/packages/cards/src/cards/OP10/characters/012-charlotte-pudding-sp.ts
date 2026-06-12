import type { CharacterCard } from "@tcg/op-types";
import { op10CharlottePuddingSp012I18n } from "./012-charlotte-pudding-sp.i18n.ts";

export const op10CharlottePuddingSp012: CharacterCard = {
  id: "ST12-012",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect: "[Activate: Main] Return this Character to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
      },
    ],
  },
  i18n: op10CharlottePuddingSp012I18n,
};
