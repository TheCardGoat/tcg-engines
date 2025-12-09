import type { CharacterCard } from "@tcg/lorcana";

export const rafikiMysteriousSage: CharacterCard = {
  id: "zqh",
  cardType: "character",
  name: "Rafiki",
  version: "Mysterious Sage",
  fullName: "Rafiki - Mysterious Sage",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 54,
  inkable: false,
  externalIds: {
    ravensburger: "80caf60ae34281409e8e7afd88224c417a282bac",
  },
  abilities: [
    {
      id: "zqh-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
};
