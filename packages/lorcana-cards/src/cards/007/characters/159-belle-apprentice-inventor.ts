import type { CharacterCard } from "@tcg/lorcana-types";

export const belleApprenticeInventor: CharacterCard = {
  id: "sb6",
  cardType: "character",
  name: "Belle",
  version: "Apprentice Inventor",
  fullName: "Belle - Apprentice Inventor",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 159,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "66089bac792b605815e7eb1bf3d028980fa7039a",
  },
  abilities: [
    {
      id: "sb6-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Inventor"],
};
