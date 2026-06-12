import type { CharacterCard } from "@tcg/op-types";
import { op13SaboSp120I18n } from "./120-sabo-sp.i18n.ts";

export const op13SaboSp120: CharacterCard = {
  id: "OP13-120",
  cardType: "character",
  color: ["black"],
  rarity: "SEC",
  setId: "OP13",
  cost: 6,
  power: 7000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-120_p4_XjhzZ5f.png",
      imageId: "OP13-120_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-120_p2_wEkYNLq.png",
      imageId: "OP13-120_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-120_p3_BOK73c4.png",
      imageId: "OP13-120_p3",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-120_p1_2A43PIv.jpg",
      imageId: "OP13-120_p1",
    },
  ],
  effect:
    "[Blocker]\n[Activate: Main] [Once Per Turn] Up to 1 of your Characters gains +2 cost until the end of your opponent's next turn. Then, give up to 1 rested DON!! card to your Leader.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2,
            duration: "untilEndOfOpponentNextTurn",
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op13SaboSp120I18n,
};
