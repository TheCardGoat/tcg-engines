import type { CharacterCard } from "@tcg/lorcana-types";

export const monsieurDarqueDespicableProprietor: CharacterCard = {
  id: "116",
  cardType: "character",
  name: "Monsieur D'Arque",
  version: "Despicable Proprietor",
  fullName: "Monsieur D'Arque - Despicable Proprietor",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "I'VE COME TO COLLECT Whenever this character quests, you may banish chosen item of yours to draw a card.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 157,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "85f3e4e008a5404dac4605d4891d9a90e91d2dcc",
  },
  abilities: [
    {
      id: "116-1",
      type: "triggered",
      name: "I'VE COME TO COLLECT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
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
      text: "I'VE COME TO COLLECT Whenever this character quests, you may banish chosen item of yours to draw a card.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
