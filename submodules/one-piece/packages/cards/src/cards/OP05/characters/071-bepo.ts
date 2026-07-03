import type { CharacterCard } from "@tcg/op-types";
import { op05Bepo071I18n } from "./071-bepo.i18n.ts";

export const op05Bepo071: CharacterCard = {
  id: "OP05-071",
  canonicalId: "OP05-071",
  slug: "bepo/op05-071",
  name: "Bepo",
  printings: [
    {
      id: "OP05-071",
      artId: "OP05-071",
      setCode: "OP05",
      collectorNumber: "071",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-071.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP05",
  cost: 3,
  power: 5000,
  traits: ["Heart Pirates Minks"],
  attribute: "strike",
  effect:
    "[When Attacking] If your opponent has more DON!! cards on their field than you, give up to 1 of your opponent's Characters -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lt",
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
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op05Bepo071I18n,
};
