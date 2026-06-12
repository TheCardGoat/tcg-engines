import type { CharacterCard } from "@tcg/op-types";
import { eb03Camie015I18n } from "./015-camie.i18n.ts";

export const eb03Camie015: CharacterCard = {
  id: "EB03-015",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB03",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may rest this Character: Give up to 1 rested DON!! card to 1 of your {Fish-Man} or {Merfolk} type Leader or Character cards. Then, rest up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Fish-Man",
                },
                {
                  filter: "trait",
                  value: "Merfolk",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
          {
            action: "rest",
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
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03Camie015I18n,
};
