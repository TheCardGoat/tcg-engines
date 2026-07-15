import type { CharacterCard } from "@tcg/lorcana-types";

export const belleApprenticeInventor: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "sb6-1",
      text: "WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.",
      type: "action",
    },
  ],
  cardNumber: 159,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess", "Inventor"],
  cost: 3,
  externalIds: {
    ravensburger: "66089bac792b605815e7eb1bf3d028980fa7039a",
  },
  franchise: "Beauty and the Beast",
  fullName: "Belle - Apprentice Inventor",
  id: "sb6",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Belle",
  set: "007",
  strength: 3,
  text: "WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.",
  version: "Apprentice Inventor",
  willpower: 3,
};
