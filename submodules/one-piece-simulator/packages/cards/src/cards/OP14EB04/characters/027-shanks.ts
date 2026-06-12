import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Shanks027I18n } from "./027-shanks.i18n.ts";

export const op14eb04Shanks027: CharacterCard = {
  id: "OP14-027",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 7,
  power: 9000,
  traits: ["The Four Emperors Red-Haired Pirates East Blue"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-027_p1_ErPVyNP.jpg",
      imageId: "OP14-027_p1",
    },
  ],
  effect:
    "[Your Turn] When this Character becomes rested, rest up to 1 of your opponent's Characters with 7000 base power or less.\n[Opponent's Turn] If this Character is rested, give all of your opponent's Characters 1000 power.",
  effects: {
    effects: [
      {
        trigger: "whenBecomesRested",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
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
                  filter: "basePower",
                  comparison: "lte",
                  value: 7000,
                },
              ],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "cardState",
            target: "this",
            property: "state",
            comparison: "eq",
            value: "rested",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Shanks027I18n,
};
