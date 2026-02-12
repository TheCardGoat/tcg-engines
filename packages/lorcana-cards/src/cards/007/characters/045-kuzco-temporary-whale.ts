import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoTemporaryWhale: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "122-1",
      name: "DON'T YOU SAY A WORD Once",
      text: "DON'T YOU SAY A WORD Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 45,
  cardType: "character",
  classifications: ["Storyborn", "King"],
  cost: 5,
  externalIds: {
    ravensburger: "8a16f3c83a53236d523529bacad2e9c79e60b668",
  },
  franchise: "Emperors New Groove",
  fullName: "Kuzco - Temporary Whale",
  id: "122",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Kuzco",
  set: "007",
  strength: 1,
  text: "DON'T YOU SAY A WORD Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
  version: "Temporary Whale",
  willpower: 4,
};
