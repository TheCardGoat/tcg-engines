import type { CharacterCard } from "@tcg/op-types";
import { st24BasilHawkins003I18n } from "./st24-003-basil-hawkins.i18n.ts";
export const st24BasilHawkins003: CharacterCard = {
  id: "ST24-003",
  canonicalId: "ST24-003",
  slug: "basil-hawkins/st24-003",
  name: "Basil Hawkins",
  printings: [
    {
      id: "ST24-003",
      artId: "ST24-003",
      setCode: "ST24",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST24-003.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST24",
  cost: 4,
  traits: ["Supernovas", "Hawkins Pirates"],
  power: 4000,
  attribute: "slash",
  counter: 2000,
  effect: "[End of Your Turn] Set up to 1 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: st24BasilHawkins003I18n,
};
