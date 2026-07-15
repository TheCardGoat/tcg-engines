import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyElegantSpaniel: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "14v-1",
      text: "A DOG'S LIFE While you have a character named Tramp in play, this character gets +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 100,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 1,
  externalIds: {
    ravensburger: "934805edfc939c3c6e92fa8b34aca79d34855421",
  },
  franchise: "Lady and the Tramp",
  fullName: "Lady - Elegant Spaniel",
  id: "14v",
  inkType: ["emerald"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Lady",
  set: "007",
  strength: 1,
  text: "A DOG'S LIFE While you have a character named Tramp in play, this character gets +1 {L}.",
  version: "Elegant Spaniel",
  willpower: 2,
};
