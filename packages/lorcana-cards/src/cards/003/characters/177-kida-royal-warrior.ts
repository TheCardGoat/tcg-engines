import type { CharacterCard } from "@tcg/lorcana";

export const kidaRoyalWarrior: CharacterCard = {
  id: "1bi",
  cardType: "character",
  name: "Kida",
  version: "Royal Warrior",
  fullName: "Kida - Royal Warrior",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "003",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "177",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "aa90cc579bd99086d5e1d845fb0cdc765a5c1e27",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "1bi-ability-1",
      text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
