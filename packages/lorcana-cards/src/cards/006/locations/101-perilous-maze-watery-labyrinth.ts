import type { LocationCard } from "@tcg/lorcana-types";

export const perilousMazeWateryLabyrinth: LocationCard = {
  abilities: [
    {
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_OPPONENT",
        chosen: true,
      },
      id: "1w9-1",
      name: "LOST IN THE WAVES",
      text: "LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 101,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "f81280fd57b41193ef1b6c791b142bd584a2a840",
  },
  franchise: "Lorcana",
  fullName: "Perilous Maze - Watery Labyrinth",
  id: "1w9",
  inkType: ["emerald"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Perilous Maze",
  set: "006",
  text: "LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.",
  version: "Watery Labyrinth",
};
