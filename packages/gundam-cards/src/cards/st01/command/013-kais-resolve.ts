import type { CommandCardDefinition } from "@tcg/gundam-types";

export const KaisResolve: CommandCardDefinition = {
  cardNumber: "ST01-013",
  cardType: "COMMAND",
  color: "blue",
  cost: 1,
  id: "st01-013",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-013.webp?26013001",
  level: 3,
  name: "Kai's Resolve",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 0,
    name: "Kai Shiden",
    traits: ["earth", "federation", "white", "base", "team"],
  },
  rarity: "common",
  setCode: "ST01",
  sourceTitle: "Mobile Suit Gundam",
  text: "【Main】Choose 1 friendly Unit. It recovers 3 HP.\n【Pilot】[Kai Shiden]",
  timing: "MAIN",
};
