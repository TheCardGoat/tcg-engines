import type { CharacterCard } from "@tcg/lorcana-types";

export const kidaRoyalWarrior: CharacterCard = {
  id: "1be",
  cardType: "character",
  name: "Kida",
  version: "Royal Warrior",
  fullName: "Kida - Royal Warrior",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "003",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 177,
  inkable: true,
  externalIds: {
    ravensburger: "aa90cc579bd99086d5e1d845fb0cdc765a5c1e27",
  },
  abilities: [
    {
      id: "1be-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
