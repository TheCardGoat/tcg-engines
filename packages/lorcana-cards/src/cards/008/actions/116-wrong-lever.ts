import type { ActionCard } from "@tcg/lorcana-types";

export const wrongLever: ActionCard = {
  id: "1mu",
  cardType: "action",
  name: "Wrong Lever!",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "008",
  text: "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
  cost: 3,
  cardNumber: 116,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d2d4cbca62b7aed01a0bd0a6e8aa2f9b358e9304",
  },
  abilities: [
    {
      id: "1mu-2",
      type: "action",
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
      text: "- Return chosen character to their player's hand.",
    },
    {
      id: "1mu-3",
      type: "action",
      effect: {
        type: "put-on-bottom",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["card"],
        },
      },
      text: "- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
    },
  ],
};
