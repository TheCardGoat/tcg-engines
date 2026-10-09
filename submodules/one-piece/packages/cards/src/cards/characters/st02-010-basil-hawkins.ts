import type { CharacterCard } from "@tcg/op-types";
import { st02BasilHawkins010I18n } from "./st02-010-basil-hawkins.i18n.ts";
export const st02BasilHawkins010: CharacterCard = {
  id: "ST02-010",
  canonicalId: "ST02-010",
  slug: "basil-hawkins/st02-010",
  name: "Basil Hawkins",
  printings: [
    {
      id: "ST02-010",
      artId: "ST02-010",
      setCode: "ST02",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST02-010.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 5,
  power: 6000,
  traits: ["Supernovas", "Hawkins Pirates"],
  attribute: "slash",
  effect:
    "[DON!! x1] [Once Per Turn] [Your Turn] If this Character battles your opponent's Character, set this card as active.",
  effects: {
    effects: [
      {
        trigger: "endOfBattle",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
        ],
        oncePerTurn: true,
        eventFilter: {
          sourceSelf: true,
          battlePowerCompared: true,
          targetFilters: [
            {
              filter: "cardCategory",
              value: "character",
            },
          ],
        },
      },
    ],
  },
  i18n: st02BasilHawkins010I18n,
};
