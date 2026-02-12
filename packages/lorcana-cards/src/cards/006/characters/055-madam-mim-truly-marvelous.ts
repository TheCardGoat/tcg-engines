import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimTrulyMarvelous: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "182-1",
      text: "OH, BAT GIZZARDS 2 {I}, Choose and discard a card - Gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 55,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "a0a2f9d71d5c784fc33c185c98d4251eec671d83",
  },
  franchise: "Sword in the Stone",
  fullName: "Madam Mim - Truly Marvelous",
  id: "182",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Madam Mim",
  set: "006",
  strength: 2,
  text: "OH, BAT GIZZARDS 2 {I}, Choose and discard a card - Gain 1 lore.",
  version: "Truly Marvelous",
  willpower: 3,
};
