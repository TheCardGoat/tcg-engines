import type { CharacterCard } from "@tcg/op-types";
import { op11Doll008I18n } from "./008-doll.i18n.ts";

export const op11Doll008: CharacterCard = {
  id: "OP11-008",
  canonicalId: "OP11-008",
  slug: "doll",
  name: "Doll",
  printings: [
    {
      id: "OP11-008",
      artId: "OP11-008",
      setCode: "OP11",
      collectorNumber: "008",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-008.jpg",
    },
    {
      id: "OP11-008_p1",
      artId: "OP11-008_p1",
      setCode: "OP11",
      collectorNumber: "008",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-008_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP11",
  cost: 4,
  power: 1000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-008_p1.jpg",
      imageId: "OP11-008_p1",
    },
  ],
  effect:
    '[Blocker]\n[On Play] You may trash 1 card from your hand: If your Leader has the "Navy" type, give up to 1 of your opponent\'s Characters 6000 power during this turn.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
            value: 6000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Doll008I18n,
};
