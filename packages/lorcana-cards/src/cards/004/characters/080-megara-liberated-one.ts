import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraLiberatedOne: CharacterCard = {
  abilities: [
    {
      id: "1qr-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
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
      id: "1qr-2",
      name: "PEOPLE ALWAYS DO CRAZY THINGS",
      text: "PEOPLE ALWAYS DO CRAZY THINGS Whenever you play a character named Hercules, you may ready this character.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 80,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "e23a2e1df645902673b16b573c2cea51fbfa1a3b",
  },
  franchise: "Hercules",
  fullName: "Megara - Liberated One",
  id: "1qr",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Megara",
  set: "004",
  strength: 4,
  text: "Ward (Opponents can't choose this character except to challenge.)\nPEOPLE ALWAYS DO CRAZY THINGS Whenever you play a character named Hercules, you may ready this character.",
  version: "Liberated One",
  willpower: 4,
};
