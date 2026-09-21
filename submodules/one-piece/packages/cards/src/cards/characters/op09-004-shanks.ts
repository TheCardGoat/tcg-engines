import type { CharacterCard } from "@tcg/op-types";
import { op09Shanks004I18n } from "./op09-004-shanks.i18n.ts";

export const op09Shanks004: CharacterCard = {
  id: "OP09-004",
  canonicalId: "OP09-004",
  slug: "shanks/op09-004",
  name: "Shanks",
  printings: [
    {
      id: "OP09-004",
      artId: "OP09-004",
      setCode: "OP09",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-004.jpg",
    },
    {
      id: "OP09-004_p1",
      artId: "OP09-004_p1",
      setCode: "OP09",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-004_p1.jpg",
    },
    {
      id: "OP09-004_p2",
      artId: "OP09-004_p2",
      setCode: "OP09",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-004_p2.jpg",
    },
    {
      id: "OP09-004_p3",
      artId: "OP09-004_p3",
      setCode: "OP09",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-004_p3.jpg",
    },
    {
      id: "OP09-004_p6",
      artId: "OP09-004_p6",
      setCode: "OP09",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-004_p6.jpg",
    },
    {
      id: "OP09-004_r1",
      artId: "OP09-004_r1",
      setCode: "OP09",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-004_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP09",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors", "Red-Haired Pirates"],
  attribute: "slash",

  effect:
    "Give all of your opponent's Characters −1000 power.\n[Rush] (This card can attack on the turn in which it is played.)",
  effects: {
    keywords: ["rush"],
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: "all" },
            },
            value: -1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op09Shanks004I18n,
};
