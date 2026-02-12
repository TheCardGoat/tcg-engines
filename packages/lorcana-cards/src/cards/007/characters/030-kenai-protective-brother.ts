import type { CharacterCard } from "@tcg/lorcana-types";

export const kenaiProtectiveBrother: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "ready",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        type: "optional",
      },
      id: "eiu-1",
      text: "HE NEEDS ME At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
      type: "action",
    },
  ],
  cardNumber: 30,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "345850a0e7457dea4d8b46cc4b73e6cc0285b496",
  },
  franchise: "Brother Bear",
  fullName: "Kenai - Protective Brother",
  id: "eiu",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Kenai",
  set: "007",
  strength: 2,
  text: "HE NEEDS ME At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
  version: "Protective Brother",
  willpower: 4,
};
