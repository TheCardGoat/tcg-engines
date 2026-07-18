import type { CharacterCard } from "@tcg/op-types";
import { op07Sterry006I18n } from "./006-sterry.i18n.ts";

export const op07Sterry006: CharacterCard = {
  id: "OP07-006",
  canonicalId: "OP07-006",
  slug: "sterry/op07-006",
  name: "Sterry",
  printings: [
    {
      id: "OP07-006",
      artId: "OP07-006",
      setCode: "OP07",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-006.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Goa Kingdom"],
  attribute: "wisdom",
  effect:
    "[On Play] You may give your 1 active Leader -5000 power during this turn: Draw 1 card and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "modifyLeaderPower",
            value: -5000,
            duration: "thisTurn",
            requiresActive: true,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07Sterry006I18n,
};
