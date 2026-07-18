import type { CharacterCard } from "@tcg/op-types";
import { op09BuildingSnake008I18n } from "./008-building-snake.i18n.ts";

export const op09BuildingSnake008: CharacterCard = {
  id: "OP09-008",
  canonicalId: "OP09-008",
  slug: "building-snake",
  name: "Building Snake",
  printings: [
    {
      id: "OP09-008",
      artId: "OP09-008",
      setCode: "OP09",
      collectorNumber: "008",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-008.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP09",
  cost: 1,
  power: 2000,
  traits: ["Red-Haired Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may place this Character at the bottom of the owner's deck: Give up to 1 of your opponent's Characters −3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnThisToDeck",
            position: "bottom",
          },
        ],
        actions: [
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
            value: -3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09BuildingSnake008I18n,
};
