import type { CharacterCard } from "@tcg/lorcana";

export const abuBoldHelmsman: CharacterCard = {
  id: "1f2",
  cardType: "character",
  name: "Abu",
  version: "Bold Helmsman",
  fullName: "Abu - Bold Helmsman",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  text: "Rush (This character can challenge the turn they're played.)",
  cardNumber: "114",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    ravensburger: "b875bd5dc6364f60d60d0e20e53a61eb2a7eb097",
  },
  keywords: ["Rush"],
  abilities: [
    {
      id: "1f2a1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
