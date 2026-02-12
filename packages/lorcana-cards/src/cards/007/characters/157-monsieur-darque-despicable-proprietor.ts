import type { CharacterCard } from "@tcg/lorcana-types";

export const monsieurDarqueDespicableProprietor: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "116-1",
      name: "I'VE COME TO COLLECT",
      text: "I'VE COME TO COLLECT Whenever this character quests, you may banish chosen item of yours to draw a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 157,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 1,
  externalIds: {
    ravensburger: "85f3e4e008a5404dac4605d4891d9a90e91d2dcc",
  },
  franchise: "Beauty and the Beast",
  fullName: "Monsieur D'Arque - Despicable Proprietor",
  id: "116",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Monsieur D'Arque",
  set: "007",
  strength: 1,
  text: "I'VE COME TO COLLECT Whenever this character quests, you may banish chosen item of yours to draw a card.",
  version: "Despicable Proprietor",
  willpower: 2,
};
