import type { CommandCardDefinition } from "@tcg/gundam-types";

export const ThoroughlyDamaged: CommandCardDefinition = {
  cardNumber: "ST01-012",
  cardType: "COMMAND",
  color: "blue",
  cost: 1,
  id: "st01-012",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-012.webp?26013001",
  level: 2,
  name: "Thoroughly Damaged",
  pilotProperties: {
    apModifier: 0,
    hpModifier: 1,
    name: "Hayato Kobayashi",
    traits: ["earth", "federation", "white", "base", "team"],
  },
  rarity: "common",
  setCode: "ST01",
  sourceTitle: "Mobile Suit Gundam",
  text: "【Main】Choose 1 rested enemy Unit. Deal 1 damage to it.\n【Pilot】[Hayato Kobayashi]",
  timing: "MAIN",
};
