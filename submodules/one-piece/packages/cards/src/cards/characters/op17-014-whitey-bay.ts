import type { CharacterCard } from "@tcg/op-types";
import { op17WhiteyBay014I18n } from "./op17-014-whitey-bay.i18n.ts";

export const op17WhiteyBay014: CharacterCard = {
  id: "OP17-014",
  canonicalId: "OP17-014",
  slug: "whitey-bay/op17-014",
  name: "Whitey Bay",
  printings: [
    {
      id: "OP17-014",
      artId: "OP17-014",
      setCode: "OP17",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-014_2iGFalB.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP17",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Whitebeard Pirates Allies"],
  attribute: "slash",
  effect:
    "[On Play] K.O. up to 1 of your opponent's Characters with 2000 base power or less.\n\n[On Your Opponent's Attack] You may trash this Character: Your Leader gains +1000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  value: 2000,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 1000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17WhiteyBay014I18n,
};
