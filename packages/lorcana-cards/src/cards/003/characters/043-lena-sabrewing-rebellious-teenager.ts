import type { CharacterCard } from "@tcg/lorcana-types";

export const lenaSabrewingRebelliousTeenager: CharacterCard = {
  id: "1j4",
  cardType: "character",
  name: "Lena Sabrewing",
  version: "Rebellious Teenager",
  fullName: "Lena Sabrewing - Rebellious Teenager",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "003",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 43,
  inkable: true,
  externalIds: {
    ravensburger: "c8008c9decb7e2f82c626c48623a36620179e03b",
  },
  abilities: [
    {
      id: "1j4-1",
      type: "keyword",
      keyword: "Rush",
    },
  ],
  classifications: ["Storyborn", "Hero", "Sorcerer"],
};
