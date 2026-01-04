import type { CharacterCard } from "@tcg/lorcana-types";

export const drFacilierremarkableGentleman: CharacterCard = {
  id: "xhk",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Remarkable Gentleman",
  fullName: "Dr. Facilier - Remarkable Gentleman",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 39,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      id: "xhk-1",
      effect: {
        type: "optional",
        effect: {
          type: "look-at-cards",
          amount: 2,
          from: "top-of-deck",
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Sorcerer", "Storyborn", "Villain"],
};
