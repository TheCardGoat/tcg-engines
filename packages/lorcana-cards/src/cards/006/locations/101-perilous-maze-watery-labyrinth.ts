import type { LocationCard } from "@tcg/lorcana-types";

export const perilousMazeWateryLabyrinth: LocationCard = {
  id: "1w9",
  cardType: "location",
  name: "Perilous Maze",
  version: "Watery Labyrinth",
  fullName: "Perilous Maze - Watery Labyrinth",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "006",
  text: "LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 101,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f81280fd57b41193ef1b6c791b142bd584a2a840",
  },
  abilities: [
    {
      id: "1w9-1",
      type: "triggered",
      name: "LOST IN THE WAVES",
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_OPPONENT",
        chosen: true,
      },
      text: "LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.",
    },
  ],
};
