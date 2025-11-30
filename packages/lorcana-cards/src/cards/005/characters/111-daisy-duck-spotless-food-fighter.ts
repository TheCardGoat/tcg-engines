import type { CharacterCard } from "@tcg/lorcana";

export const daisyDuckSpotlessFoodfighter: CharacterCard = {
  id: "1d8",
  cardType: "character",
  name: "Daisy Duck",
  version: "Spotless Food-Fighter",
  fullName: "Daisy Duck - Spotless Food-Fighter",
  inkType: ["ruby"],
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "111",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "b1724348bcda8483959b2f906793c0d8ec1ee40a",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1d8a1",
      text: "Evasive",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
