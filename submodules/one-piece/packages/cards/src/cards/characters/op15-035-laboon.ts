import type { CharacterCard } from "@tcg/op-types";
import { op15Laboon035I18n } from "./op15-035-laboon.i18n.ts";

export const op15Laboon035: CharacterCard = {
  id: "OP15-035",
  canonicalId: "OP15-035",
  slug: "laboon/op15-035",
  name: "Laboon",
  printings: [
    {
      id: "OP15-035",
      artId: "OP15-035",
      setCode: "OP15",
      collectorNumber: "035",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-035_3h8VI9h.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP15",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Animal"],
  attribute: "strike",
  effect:
    "If your Character with 7000 base power or less would be removed from the field by your opponent's effect, you may rest 2 of your cards instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "basePower",
              comparison: "lte",
              value: 7000,
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["leader", "character", "stage", "costArea"],
            count: {
              amount: 2,
            },
          },
        },
      },
    ],
  },
  i18n: op15Laboon035I18n,
};
