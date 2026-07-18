import type { CharacterCard } from "@tcg/op-types";
import { op08Aphelandra041I18n } from "./041-aphelandra.i18n.ts";

export const op08Aphelandra041: CharacterCard = {
  id: "OP08-041",
  canonicalId: "OP08-041",
  slug: "aphelandra",
  name: "Aphelandra",
  printings: [
    {
      id: "OP08-041",
      artId: "OP08-041",
      setCode: "OP08",
      collectorNumber: "041",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-041.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Amazon Lily"],
  attribute: "slash",
  effect:
    "[Activate:Main] You may return this Character to the owner's hand: If your Leader has the {Kuja Pirates} type, place up to 1 of your opponent's Characters with a cost of 1 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnThisToHand",
          },
        ],
        actions: [
          {
            action: "returnToDeck",
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
                  value: 1,
                },
              ],
            },
            position: "bottom",
            condition: {
              condition: "leaderTrait",
              trait: "Kuja Pirates",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08Aphelandra041I18n,
};
