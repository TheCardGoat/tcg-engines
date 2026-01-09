import type { CharacterCard } from "@tcg/lorcana-types";

export const drFacilierRemarkableGentleman: CharacterCard = {
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
      type: "triggered",
      name: "DREAMS MADE REAL",
      text: "**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      id: "xhk-1",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "song",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "scry",
          amount: 2,
          destinations: [
            { zone: "deck-top", min: 1, max: 1 },
            { zone: "deck-bottom", remainder: true },
          ],
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Sorcerer", "Storyborn", "Villain"],
};
