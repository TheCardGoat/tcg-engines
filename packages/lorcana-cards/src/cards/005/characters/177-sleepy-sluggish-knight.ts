import type { CharacterCard } from "@tcg/lorcana";

export const sleepySluggishKnight: CharacterCard = {
  id: "1k0",
  cardType: "character",
  name: "Sleepy",
  version: "Sluggish Knight",
  fullName: "Sleepy - Sluggish Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "177",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "c9ec3115210a0d6350a7df1c16405f550b05b3cd",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "1k0a1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
};
