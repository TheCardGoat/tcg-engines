import type { CharacterCard } from "@tcg/lorcana-types";

export const annaBravingTheStorm: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "mi9-1",
      text: "I WAS BORN READY While you have another Hero character in play, this character gets +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 146,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Queen"],
  cost: 2,
  externalIds: {
    ravensburger: "511e7eed599c91d73d5cc4ea8991964dc1efe12a",
  },
  franchise: "Frozen",
  fullName: "Anna - Braving the Storm",
  id: "mi9",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Anna",
  set: "009",
  strength: 1,
  text: "I WAS BORN READY While you have another Hero character in play, this character gets +1 {L}.",
  version: "Braving the Storm",
  willpower: 4,
};
