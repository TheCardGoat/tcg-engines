import type { CharacterCard } from "@tcg/lorcana-types";

export const edLaughingHyena: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 2,
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
      id: "1ez-1",
      name: "CAUSE A PANIC",
      text: "CAUSE A PANIC When you play this character, you may deal 2 damage to chosen damaged character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 74,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Hyena"],
  cost: 3,
  externalIds: {
    ravensburger: "b7b8cf126ca56fb72ae47f7dc67180a793b855e2",
  },
  franchise: "Lion King",
  fullName: "Ed - Laughing Hyena",
  id: "1ez",
  inkType: ["emerald"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Ed",
  set: "005",
  strength: 2,
  text: "CAUSE A PANIC When you play this character, you may deal 2 damage to chosen damaged character.",
  version: "Laughing Hyena",
  willpower: 3,
};
