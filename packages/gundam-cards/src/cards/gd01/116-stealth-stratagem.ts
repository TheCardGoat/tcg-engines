import type { CommandCardDefinition } from "@tcg/gundam-types";

export const StealthStratagem: CommandCardDefinition = {
  id: "gd01-116",
  name: "Stealth Stratagem",
  cardNumber: "GD01-116",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 1,
  text: "【Main】/【Action】Choose 1 enemy Unit with 2 or less AP. Deal 2 damage to it.\n【Pilot】[Nicol Amarfi]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-116.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  pilotProperties: {
    name: "Nicol Amarfi",
    traits: ["zaft", "coordinator"],
    apModifier: 0,
    hpModifier: 1,
  },
  abilities: [
    {
      description:
        "【Main】/【Action】Choose 1 enemy Unit with 2 or less AP. Deal 2 damage to it. 【Pilot】[Nicol Amarfi]",
      effect: {
        type: "DAMAGE",
        amount: 2,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
