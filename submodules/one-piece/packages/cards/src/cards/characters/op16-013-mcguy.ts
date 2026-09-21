import type { CharacterCard } from "@tcg/op-types";
import { op16McGuy013I18n } from "./op16-013-mcguy.i18n.ts";

export const op16McGuy013: CharacterCard = {
  id: "OP16-013",
  canonicalId: "OP16-013",
  slug: "mcguy/op16-013",
  name: "McGuy",
  printings: [
    {
      id: "OP16-013",
      artId: "OP16-013",
      setCode: "OP16",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-013_tn9slyz.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP16",
  cost: 6,
  power: 8000,
  traits: ["Whitebeard Pirates Allies"],
  attribute: "slash",
  effect: "[On K.O.] K.O. Up to 1 of your opponent's Characters with 8000 base power or less.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 8000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op16McGuy013I18n,
};
