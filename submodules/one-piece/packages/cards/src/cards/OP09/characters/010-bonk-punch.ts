import type { CharacterCard } from "@tcg/op-types";
import { op09BonkPunch010I18n } from "./010-bonk-punch.i18n.ts";

export const op09BonkPunch010: CharacterCard = {
  id: "OP09-010",
  canonicalId: "OP09-010",
  slug: "bonk-punch",
  name: "Bonk Punch",
  printings: [
    {
      id: "OP09-010",
      artId: "OP09-010",
      setCode: "OP09",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-010.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "strike",
  effect:
    "[On Play] Play up to 1 [Monster] from your hand.\n[DON!! x1] [When Attacking] This Character gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Monster",
              },
            ],
          },
        ],
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
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
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op09BonkPunch010I18n,
};
