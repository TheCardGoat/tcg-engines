import type { CharacterCard } from "@tcg/lorcana-types";

export const TheQueenWickedAndVain: CharacterCard = {
  id: "y32",
  cardType: "character",
  name: "The Queen",
  version: "Wicked and Vain",
  fullName: "The Queen - Wicked and Vain",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**I SUMMON THEE** {E} − Draw a card.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 56,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**I SUMMON THEE** {E} − Draw a card.",
      id: "y32-1",
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Queen", "Storyborn", "Villain"],
};
