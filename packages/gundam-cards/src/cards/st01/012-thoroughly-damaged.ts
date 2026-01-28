import type { CommandCardDefinition } from "@tcg/gundam-types";

export const ThoroughlyDamaged: CommandCardDefinition = {
  id: "st01-012",
  name: "Thoroughly Damaged",
  cardNumber: "ST01-012",
  setCode: "ST01",
  cardType: "COMMAND",
  rarity: "common",
  color: "blue",
  level: 2,
  cost: 1,
  text: "【Main】Choose 1 rested enemy Unit. Deal 1 damage to it.\n【Pilot】[Hayato Kobayashi]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-012.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  timing: "MAIN",
  pilotProperties: {
    name: "Hayato Kobayashi",
    traits: ["earth", "federation", "white", "base", "team"],
    apModifier: 0,
    hpModifier: 1,
  },
  effects: [
    {
      id: "eff-3gffflt89",
      type: "CONSTANT",
      description:
        "Choose 1 rested enemy Unit. Deal 1 damage to it. 【Pilot】[Hayato Kobayashi]",
      restrictions: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 1,
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "exerted",
            },
          ],
        },
      },
    },
  ],
};
