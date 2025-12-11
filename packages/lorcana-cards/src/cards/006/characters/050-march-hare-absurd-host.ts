import type { CharacterCard } from "@tcg/lorcana";

export const marchHareAbsurdHost: CharacterCard = {
  id: "110",
  cardType: "character",
  name: "March Hare",
  version: "Absurd Host",
  fullName: "March Hare - Absurd Host",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 50,
  inkable: true,
  externalIds: {
    ravensburger: "85684498bb53ffacf3dd58bf50013dc97d5766b6",
  },
  abilities: [
    {
      id: "110-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Storyborn"],
};
