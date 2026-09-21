import type { CharacterCard } from "@tcg/op-types";
import { op16SpeedJil009I18n } from "./op16-009-speed-jil.i18n.ts";

export const op16SpeedJil009: CharacterCard = {
  id: "OP16-009",
  canonicalId: "OP16-009",
  slug: "speed-jil/op16-009",
  name: "Speed Jil",
  printings: [
    {
      id: "OP16-009",
      artId: "OP16-009",
      setCode: "OP16",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-009_c9szVFX.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP16",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 Character card with 8000 power from your hand: This Character gains [Rush] and +2000 power until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "eq",
                value: 8000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "untilEndOfOpponentNextEndPhase",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op16SpeedJil009I18n,
};
