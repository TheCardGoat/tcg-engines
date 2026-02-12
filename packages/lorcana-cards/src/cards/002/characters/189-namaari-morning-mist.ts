import type { CharacterCard } from "@tcg/lorcana-types";

export const namaariMorningMist: CharacterCard = {
  abilities: [
    {
      id: "1dg-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        target: "SELF",
      },
      id: "1dg-2",
      name: "BLADES",
      text: "BLADES This character can challenge ready characters.",
      type: "static",
    },
  ],
  cardNumber: 189,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "b374629cdd5ecdc326ac5f23af8fd172452f319a",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Namaari - Morning Mist",
  id: "1dg",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Namaari",
  set: "002",
  strength: 2,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBLADES This character can challenge ready characters.",
  version: "Morning Mist",
  willpower: 4,
};
