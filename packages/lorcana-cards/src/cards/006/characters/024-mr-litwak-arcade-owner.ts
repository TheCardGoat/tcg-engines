import type { CharacterCard } from "@tcg/lorcana-types";

export const mrLitwakArcadeOwner: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "self",
            zones: ["play"],
          },
          type: "ready",
        },
        type: "optional",
      },
      id: "byt-1",
      name: "THE GANG'S ALL HERE Once",
      text: "THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 24,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 3,
  externalIds: {
    ravensburger: "2b218e9fef97146992d8ada33a9b4abcc9bc1c1b",
  },
  franchise: "Wreck It Ralph",
  fullName: "Mr. Litwak - Arcade Owner",
  id: "byt",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mr. Litwak",
  set: "006",
  strength: 2,
  text: "THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.",
  version: "Arcade Owner",
  willpower: 3,
};
