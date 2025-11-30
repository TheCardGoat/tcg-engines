import type { CharacterCard } from "@tcg/lorcana";

export const simbaProtectiveCub: CharacterCard = {
  id: "rvm",
  cardType: "character",
  name: "Simba",
  version: "Protective Cub",
  fullName: "Simba - Protective Cub",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "020",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "6479a6ae550768c207018562ce6f687ec41e7c86",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "rvma1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
