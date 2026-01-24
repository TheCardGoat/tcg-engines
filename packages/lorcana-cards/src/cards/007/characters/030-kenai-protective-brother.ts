import type { CharacterCard } from "@tcg/lorcana-types";

export const kenaiProtectiveBrother: CharacterCard = {
  id: "eiu",
  cardType: "character",
  name: "Kenai",
  version: "Protective Brother",
  fullName: "Kenai - Protective Brother",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "007",
  text: "HE NEEDS ME At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 30,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "345850a0e7457dea4d8b46cc4b73e6cc0285b496",
  },
  abilities: [
    {
      id: "eiu-1",
      type: "action",
      effect: {
        type: "optional",
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
        chooser: "CONTROLLER",
      },
      text: "HE NEEDS ME At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
