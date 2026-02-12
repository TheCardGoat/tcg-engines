import type { CommandCardDefinition } from "@tcg/gundam-types";

export const HawkOfEndymion: CommandCardDefinition = {
  cardNumber: "ST04-013",
  cardType: "COMMAND",
  color: "white",
  cost: 1,
  id: "st04-013",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-013.webp?26013001",
  level: 2,
  name: "Hawk of Endymion",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 0,
    name: "Mu La Flaga",
    traits: ["earth", "alliance"],
  },
  rarity: "common",
  setCode: "ST04",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.\n【Pilot】[Mu La Flaga]",
  timing: "MAIN",
};
