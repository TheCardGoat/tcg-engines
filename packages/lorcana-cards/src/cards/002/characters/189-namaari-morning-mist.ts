import type { CharacterCard } from "@tcg/lorcana-types";

export const namaariMorningMist: CharacterCard = {
  id: "1dg",
  cardType: "character",
  name: "Namaari",
  version: "Morning Mist",
  fullName: "Namaari - Morning Mist",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBLADES This character can challenge ready characters.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 189,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b374629cdd5ecdc326ac5f23af8fd172452f319a",
  },
  abilities: [
    {
      id: "1dg-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "1dg-2",
      type: "static",
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        target: "SELF",
      },
      name: "BLADES",
      text: "BLADES This character can challenge ready characters.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Princess"],
};
