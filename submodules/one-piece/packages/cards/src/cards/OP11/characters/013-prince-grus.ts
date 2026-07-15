import type { CharacterCard } from "@tcg/op-types";
import { op11PrinceGrus013I18n } from "./013-prince-grus.i18n.ts";

export const op11PrinceGrus013: CharacterCard = {
  id: "OP11-013",
  canonicalId: "OP11-013",
  slug: "prince-grus",
  name: "Prince Grus",
  printings: [
    {
      id: "OP11-013",
      artId: "OP11-013",
      setCode: "OP11",
      collectorNumber: "013",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-013.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Navy SWORD"],
  attribute: "special",
  effect:
    "[When Attacking] All of your opponent's Characters with 2000 power or less cannot activate [Blocker] during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 2000,
                },
              ],
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op11PrinceGrus013I18n,
};
