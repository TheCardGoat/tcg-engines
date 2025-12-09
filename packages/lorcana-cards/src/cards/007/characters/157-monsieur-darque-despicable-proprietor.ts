import type { CharacterCard } from "@tcg/lorcana";

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
  externalIds: {
    ravensburger: "85f3e4e008a5404dac4605d4891d9a90e91d2dcc",
  },
  abilities: [
    {
      id: "116-1",
      text: "I'VE COME TO COLLECT Whenever this character quests, you may banish chosen item of yours to draw a card.",
      name: "I'VE COME TO COLLECT",
      type: "triggered",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
