import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaUnjustlyTreated: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "1pn-1",
      name: "I'M WARNING YOU!",
      text: "I'M WARNING YOU! During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 184,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "de2bbba966f5728b34ff142c8f594b4bc193ef32",
  },
  franchise: "Emperors New Groove",
  fullName: "Yzma - Unjustly Treated",
  id: "1pn",
  inkType: ["steel"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Yzma",
  set: "005",
  strength: 1,
  text: "I'M WARNING YOU! During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.",
  version: "Unjustly Treated",
  willpower: 4,
};
