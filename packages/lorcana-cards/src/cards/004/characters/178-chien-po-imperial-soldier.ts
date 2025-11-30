import type { CharacterCard } from "@tcg/lorcana";

export const chienpoImperialSoldier: CharacterCard = {
  id: "1m9",
  cardType: "character",
  name: "Chien-Po",
  version: "Imperial Soldier",
  fullName: "Chien-Po - Imperial Soldier",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "178",
  cost: 5,
  strength: 4,
  willpower: 7,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "d1fd5839ad177cf9b28ff3c6336c8cb568683243",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "1m9-ability-1",
      text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
