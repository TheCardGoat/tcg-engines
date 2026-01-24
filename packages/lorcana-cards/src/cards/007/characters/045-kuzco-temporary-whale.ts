import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoTemporaryWhale: CharacterCard = {
  id: "122",
  cardType: "character",
  name: "Kuzco",
  version: "Temporary Whale",
  fullName: "Kuzco - Temporary Whale",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "007",
  text: "DON'T YOU SAY A WORD Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 45,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "8a16f3c83a53236d523529bacad2e9c79e60b668",
  },
  abilities: [
    {
      id: "122-1",
      type: "triggered",
      name: "DON'T YOU SAY A WORD Once",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
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
      text: "DON'T YOU SAY A WORD Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
    },
  ],
  classifications: ["Storyborn", "King"],
};
