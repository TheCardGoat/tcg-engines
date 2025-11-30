import type { CharacterCard } from "@tcg/lorcana";

export const herculesTrueHero: CharacterCard = {
  id: "1ch",
  cardType: "character",
  name: "Hercules",
  version: "True Hero",
  fullName: "Hercules - True Hero",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "009",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "191",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "aec8753f7f97cb51feeedf58b45f27661b18c44e",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "1cha1",
      text: "Bodyguard",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
};
