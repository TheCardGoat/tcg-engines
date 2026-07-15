import type { CharacterCard } from "@tcg/lorcana-types";

export const flotsamJetsamEntanglingEels: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        chosen: false,
        target: "CONTROLLER",
        type: "discard",
      },
      id: "1j0-1",
      text: "Shift: Discard 2 cards",
      type: "action",
    },
  ],
  cardNumber: 44,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "c63d1e30731763bca52de192578836dccb9a5fb1",
  },
  franchise: "Little Mermaid",
  fullName: "Flotsam & Jetsam - Entangling Eels",
  id: "1j0",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Flotsam & Jetsam",
  set: "004",
  strength: 5,
  text: "Shift: Discard 2 cards (You may discard 2 cards to play this on top of one of your characters named Flotsam or Jetsam.)\n(This character counts as being named both Flotsam and Jetsam.)",
  version: "Entangling Eels",
  willpower: 5,
};
