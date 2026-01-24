import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyElegantSpaniel: CharacterCard = {
  id: "14v",
  cardType: "character",
  name: "Lady",
  version: "Elegant Spaniel",
  fullName: "Lady - Elegant Spaniel",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "A DOG'S LIFE While you have a character named Tramp in play, this character gets +1 {L}.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 100,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "934805edfc939c3c6e92fa8b34aca79d34855421",
  },
  abilities: [
    {
      id: "14v-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      text: "A DOG'S LIFE While you have a character named Tramp in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
