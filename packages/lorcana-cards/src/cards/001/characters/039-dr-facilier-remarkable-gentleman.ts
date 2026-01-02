import type { CharacterCard } from "@tcg/lorcana";

export const drFacilierRemarkableGentleman: CharacterCard = {
  id: "bmx",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Remarkable Gentleman",
  fullName: "Dr. Facilier - Remarkable Gentleman",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "001",
  text: "DREAMS MADE REAL Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 39,
  inkable: true,
  externalIds: {
    ravensburger: "29f0a5ba87ff15dad595a8947b198bb7319d02f8",
  },
  abilities: [
    {
      id: "bmx-1",
      text: "DREAMS MADE REAL Whenever you play a song, you may look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      name: "DREAMS MADE REAL",
      type: "triggered",
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
          type: "look-at-cards",
          amount: 2,
          from: "top-of-deck",
          target: "CONTROLLER",
          then: {
            action: "put-on-top",
            count: 1,
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
