import type { CharacterCard } from "@tcg/op-types";
import { op15Cabaji005I18n } from "./op15-005-cabaji.i18n.ts";

export const op15Cabaji005: CharacterCard = {
  id: "OP15-005",
  canonicalId: "OP15-005",
  slug: "cabaji/op15-005",
  name: "Cabaji",
  printings: [
    {
      id: "OP15-005",
      artId: "OP15-005",
      setCode: "OP15",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-005_ycH14Fr.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP15",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Buggy Pirates East Blue"],
  attribute: "slash",
  effect:
    "[When Attacking] If your opponent has any DON!! cards given, this Character gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "givenDonCount",
            player: "opponent",
            comparison: "gte",
            value: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op15Cabaji005I18n,
};
