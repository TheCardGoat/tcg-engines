import type { ActionCard } from "@tcg/lorcana-types";

export const inkGeyser: ActionCard = {
  id: "1ny",
  cardType: "action",
  name: "Ink Geyser",
  inkType: ["emerald", "sapphire"],
  franchise: "Lorcana",
  set: "007",
  text: "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
  cost: 3,
  cardNumber: 119,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d4b8b8bbbaefeaf584e85192063ab4a5fce656af",
  },
  abilities: [],
};
