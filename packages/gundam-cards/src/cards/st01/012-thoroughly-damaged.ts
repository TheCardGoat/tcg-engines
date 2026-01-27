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
  abilities: [
    {
      description:
        "【Main】Choose 1 rested enemy Unit. Deal 1 damage to it. 【Pilot】[Hayato Kobayashi]",
      effect: {
        type: "DAMAGE",
        amount: 1,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
