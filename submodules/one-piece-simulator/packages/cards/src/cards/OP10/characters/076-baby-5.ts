import type { CharacterCard } from "@tcg/op-types";
import { op10Baby5076I18n } from "./076-baby-5.i18n.ts";

export const op10Baby5076: CharacterCard = {
  id: "OP10-076",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP10",
  cost: 3,
  power: 1000,
  counter: 2000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    '[On Play] You may trash 1 card from your hand: If your Leader has the "Donquixote Pirates" type, add up to 1 DON!! card from your DON!! deck and set it as active.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Donquixote Pirates",
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
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Baby5076I18n,
};
