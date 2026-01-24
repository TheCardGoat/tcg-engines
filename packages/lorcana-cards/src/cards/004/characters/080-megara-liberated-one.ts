import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraLiberatedOne: CharacterCard = {
  id: "1qr",
  cardType: "character",
  name: "Megara",
  version: "Liberated One",
  fullName: "Megara - Liberated One",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "Ward (Opponents can't choose this character except to challenge.)\nPEOPLE ALWAYS DO CRAZY THINGS Whenever you play a character named Hercules, you may ready this character.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 80,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e23a2e1df645902673b16b573c2cea51fbfa1a3b",
  },
  abilities: [
    {
      id: "1qr-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "1qr-2",
      type: "triggered",
      name: "PEOPLE ALWAYS DO CRAZY THINGS",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
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
      text: "PEOPLE ALWAYS DO CRAZY THINGS Whenever you play a character named Hercules, you may ready this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
