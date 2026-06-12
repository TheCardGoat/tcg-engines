import type { CharacterCard } from "@tcg/op-types";
import { op09MonkeyDDragonSp015I18n } from "./015-monkey-d-dragon-sp.i18n.ts";

export const op09MonkeyDDragonSp015: CharacterCard = {
  id: "OP07-015",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP09",
  cost: 8,
  power: 9000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "[Rush] (This card can attack on the turn in which it is played.)\n[On Play] Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op09MonkeyDDragonSp015I18n,
};
