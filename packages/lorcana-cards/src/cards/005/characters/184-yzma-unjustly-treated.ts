import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaUnjustlyTreated: CharacterCard = {
  id: "1pn",
  cardType: "character",
  name: "Yzma",
  version: "Unjustly Treated",
  fullName: "Yzma - Unjustly Treated",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "I'M WARNING YOU! During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 184,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "de2bbba966f5728b34ff142c8f594b4bc193ef32",
  },
  abilities: [
    {
      id: "1pn-1",
      type: "triggered",
      name: "I'M WARNING YOU!",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
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
      text: "I'M WARNING YOU! During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};
