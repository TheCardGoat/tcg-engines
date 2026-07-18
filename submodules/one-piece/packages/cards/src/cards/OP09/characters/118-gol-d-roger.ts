import type { CharacterCard } from "@tcg/op-types";
import { op09GolDRoger118I18n } from "./118-gol-d-roger.i18n.ts";

export const op09GolDRoger118: CharacterCard = {
  id: "OP09-118",
  canonicalId: "OP09-118",
  slug: "gol-d-roger/op09-118",
  name: "Gol.D.Roger",
  printings: [
    {
      id: "OP09-118",
      artId: "OP09-118",
      setCode: "OP09",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-118.jpg",
    },
    {
      id: "OP09-118_p2",
      artId: "OP09-118_p2",
      setCode: "OP09",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-118_p2.jpg",
    },
    {
      id: "OP09-118_p1",
      artId: "OP09-118_p1",
      setCode: "OP09",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-118_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SEC",
  setId: "OP09",
  cost: 10,
  power: 13000,
  traits: ["Roger Pirates King of the Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-118_p2.jpg",
      imageId: "OP09-118_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-118_p1.jpg",
      imageId: "OP09-118_p1",
    },
  ],
  effect:
    "[Rush] (This card can attack on the turn in which it is played.)\nWhen your opponent activates [Blocker], if either you or your opponent has 0 Life cards, you win the game.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "whenBlockerActivated",
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "lifeCount",
                player: "self",
                comparison: "eq",
                value: 0,
              },
              {
                condition: "lifeCount",
                player: "opponent",
                comparison: "eq",
                value: 0,
              },
            ],
          },
        ],
        actions: [
          {
            action: "winGame",
          },
        ],
      },
    ],
  },
  i18n: op09GolDRoger118I18n,
};
