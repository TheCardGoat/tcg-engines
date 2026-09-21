import type { CharacterCard } from "@tcg/op-types";
import { op16Squard008I18n } from "./op16-008-squard.i18n.ts";

export const op16Squard008: CharacterCard = {
  id: "OP16-008",
  canonicalId: "OP16-008",
  slug: "squard/op16-008",
  name: "Squard",
  printings: [
    {
      id: "OP16-008",
      artId: "OP16-008",
      setCode: "OP16",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-008_S78XlEt.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP16",
  cost: 5,
  power: 7000,
  traits: ["Whitebeard Pirates Allies"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 of your Characters with 10000 base power: K.O. up to 1 of your opponent's Characters with 8000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashCharacter",
            amount: 1,
            filters: [
              {
                filter: "basePower",
                comparison: "eq",
                value: 10000,
              },
            ],
          },
        ],
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
                  filter: "power",
                  comparison: "lte",
                  value: 8000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op16Squard008I18n,
};
