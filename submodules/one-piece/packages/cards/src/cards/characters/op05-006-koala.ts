import type { CharacterCard } from "@tcg/op-types";
import { op05Koala006I18n } from "./op05-006-koala.i18n.ts";

export const op05Koala006: CharacterCard = {
  id: "OP05-006",
  canonicalId: "OP05-006",
  slug: "koala/op05-006",
  name: "Koala",
  printings: [
    {
      id: "OP05-006",
      artId: "OP05-006",
      setCode: "OP05",
      collectorNumber: "006",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-006.jpg",
    },
    {
      id: "EB03_OP05-006_p1",
      artId: "EB03_OP05-006_p1",
      setCode: "OP05",
      collectorNumber: "006",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03_OP05-006_p1.jpg",
    },
    {
      id: "OP05-006_p1",
      artId: "OP05-006_p1",
      setCode: "OP05",
      collectorNumber: "006",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-006_p1.jpg",
    },
    {
      id: "OP05-006_p3",
      artId: "OP05-006_p3",
      setCode: "OP05",
      collectorNumber: "006",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-006_p3.jpg",
      label: "Koala (Alternate Art)",
    },
    {
      id: "OP05-006_r1",
      artId: "OP05-006_r1",
      setCode: "OP05",
      collectorNumber: "006",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-006_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP05",
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
            match: "includes",
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
