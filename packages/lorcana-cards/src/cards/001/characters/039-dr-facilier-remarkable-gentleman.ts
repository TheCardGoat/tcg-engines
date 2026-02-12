import type { CharacterCard } from "@tcg/lorcana-types";

export const drFacilierRemarkableGentleman: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          destinations: [
            { max: 1, min: 1, zone: "deck-top" },
            { remainder: true, zone: "deck-bottom" },
          ],
          type: "scry",
        },
        type: "optional",
      },
      id: "xhk-1",
      name: "DREAMS MADE REAL",
      text: "**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 39,
  cardType: "character",
  classifications: ["Sorcerer", "Storyborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Dr. Facilier - Remarkable Gentleman",
  id: "xhk",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Dr. Facilier",
  set: "001",
  strength: 2,
  text: "**DREAMS MADE REAL** Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  version: "Remarkable Gentleman",
  willpower: 4,
};
