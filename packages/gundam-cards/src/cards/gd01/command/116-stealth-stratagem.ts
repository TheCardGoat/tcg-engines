import type { CommandCardDefinition } from "@tcg/gundam-types";

export const StealthStratagem: CommandCardDefinition = {
  cardNumber: "GD01-116",
  cardType: "COMMAND",
  color: "red",
  cost: 1,
  id: "gd01-116",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-116.webp?26013001",
  level: 2,
  name: "Stealth Stratagem",
  pilotProperties: {
    apModifier: 0,
    hpModifier: 1,
    name: "Nicol Amarfi",
    traits: ["zaft", "coordinator"],
  },
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Main】/【Action】Choose 1 enemy Unit with 2 or less AP. Deal 2 damage to it.\n【Pilot】[Nicol Amarfi]",
  timing: "MAIN",
};
