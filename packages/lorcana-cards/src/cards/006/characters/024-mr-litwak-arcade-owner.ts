import type { CharacterCard } from "@tcg/lorcana-types";

export const mrLitwakArcadeOwner: CharacterCard = {
  id: "byt",
  cardType: "character",
  name: "Mr. Litwak",
  version: "Arcade Owner",
  fullName: "Mr. Litwak - Arcade Owner",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 24,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2b218e9fef97146992d8ada33a9b4abcc9bc1c1b",
  },
  abilities: [
    {
      id: "byt-1",
      type: "triggered",
      name: "THE GANG'S ALL HERE Once",
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn"],
};
