import type { CharacterCard } from "@tcg/lorcana";

export const heiheiProtectiveRooster: CharacterCard = {
  id: "9lo",
  cardType: "character",
  name: "HeiHei",
  version: "Protective Rooster",
  fullName: "HeiHei - Protective Rooster",
  inkType: ["steel"],
  franchise: "Moana",
  set: "005",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "179",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "229b50a7f3386e0bd2aa989a726fa7a22826eee1",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "9loa1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
