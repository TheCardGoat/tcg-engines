import type { CharacterCard } from "@tcg/lorcana";

export const luisaMadrigalMagicallyStrongOne: CharacterCard = {
  id: "1rs",
  cardType: "character",
  name: "Luisa Madrigal",
  version: "Magically Strong One",
  fullName: "Luisa Madrigal - Magically Strong One",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "009",
  text: "Rush (This character can challenge the turn they're played.)",
  cardNumber: "058",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    ravensburger: "e5dd22ae0e83e9f520522e07643858b4e2d081e7",
  },
  keywords: ["Rush"],
  abilities: [
    {
      id: "1rsa1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
