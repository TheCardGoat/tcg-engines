import type { ActionCard } from "@tcg/lorcana-types";

export const wrongLever: ActionCard = {
  abilities: [
    {
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
      id: "1mu-2",
      text: "- Return chosen character to their player's hand.",
      type: "action",
    },
    {
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
      id: "1mu-3",
      text: "- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
      type: "action",
    },
  ],
  cardNumber: 116,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "d2d4cbca62b7aed01a0bd0a6e8aa2f9b358e9304",
  },
  franchise: "Emperors New Groove",
  id: "1mu",
  inkType: ["emerald"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Wrong Lever!",
  set: "008",
  text: "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
};
