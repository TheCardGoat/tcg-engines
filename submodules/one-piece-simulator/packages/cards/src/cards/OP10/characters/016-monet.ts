import type { CharacterCard } from "@tcg/op-types";
import { op10Monet016I18n } from "./016-monet.i18n.ts";

export const op10Monet016: CharacterCard = {
  id: "OP10-016",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP10",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Donquixote Pirates Punk Hazard"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-016_p1.jpg",
      imageId: "OP10-016_p1",
    },
  ],
  effect:
    "[Activate: Main] You may rest this Character: Give up to 2 rested DON!! cards to your Leader or 1 of your Characters. Then, give up to 1 of your opponent's Characters 1000 power during this turn.",
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
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Monet016I18n,
};
