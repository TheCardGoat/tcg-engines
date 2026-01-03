import type { CharacterCard } from "@tcg/lorcana-types";

export const SimbaProtectiveCub: CharacterCard = {
  id: "rvm",
  cardType: "character",
  name: "Simba",
  version: "Protective Cub",
  fullName: "Simba - Protective Cub",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 20,
  inkable: true,
  externalIds: {
    ravensburger: "6479a6ae550768c207018562ce6f687ec41e7c86",
  },
  abilities: [
    {
      id: "rvm-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
