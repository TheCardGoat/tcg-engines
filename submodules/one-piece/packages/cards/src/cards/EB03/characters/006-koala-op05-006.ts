import type { CharacterCard } from "@tcg/op-types";
import { eb03KoalaOp05006006I18n } from "./006-koala-op05-006.i18n.ts";

export const eb03KoalaOp05006006: CharacterCard = {
  id: "OP05-006",
  canonicalId: "OP05-006",
  slug: "koala-op05-006",
  name: "Koala - OP05-006",
  printings: [
    {
      id: "OP05-006",
      artId: "OP05-006",
      setCode: "EB03",
      collectorNumber: "006",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-006_whMIxAV.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "EB03",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Revolutionary Army"],
  attribute: "strike",
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
  i18n: eb03KoalaOp05006006I18n,
};
