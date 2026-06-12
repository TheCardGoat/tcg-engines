import type { CharacterCard } from "@tcg/op-types";
import { op09Stronger089I18n } from "./089-stronger.i18n.ts";

export const op09Stronger089: CharacterCard = {
  id: "OP09-089",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP09",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Animal Blackbeard Pirates"],
  attribute: "wisdom",
  effect:
    '[Activate: Main] You may trash 1 card from your hand and trash this Character: If your Leader has the "Blackbeard Pirates" type, draw 1 card. Then, give up to 1 of your opponent\'s Characters –2 cost during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
          },
        ],
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
  i18n: op09Stronger089I18n,
};
