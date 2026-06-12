import type { CharacterCard } from "@tcg/op-types";
import { op05Koala006I18n } from "./006-koala.i18n.ts";

export const op05Koala006: CharacterCard = {
  id: "OP05-006",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP05",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Revolutionary Army"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-006_p1.jpg",
      imageId: "OP05-006_p1",
    },
  ],
  effect:
    "[On Play] If your Leader has the [Revolutionary Army] type, give up to 1 of your opponent's Characters -3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Revolutionary Army",
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
      },
    ],
  },
  i18n: op05Koala006I18n,
};
