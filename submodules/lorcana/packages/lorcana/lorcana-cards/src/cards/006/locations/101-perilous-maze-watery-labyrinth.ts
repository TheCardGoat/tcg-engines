import type { LocationCard } from "@tcg/lorcana-types";
import { perilousMazeWateryLabyrinthI18n } from "./101-perilous-maze-watery-labyrinth.i18n";

export const perilousMazeWateryLabyrinth: LocationCard = {
  id: "e5W",
  canonicalId: "ci_e5W",
  reprints: ["set6-101"],
  cardType: "location",
  name: "Perilous Maze",
  version: "Watery Labyrinth",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "006",
  cardNumber: 101,
  rarity: "common",
  cost: 3,
  willpower: 8,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_766de0c1ae8b4e5da1ecd7740eb5feb8",
    tcgPlayer: 592027,
  },
  text: [
    {
      title: "LOST IN THE WAVES",
      description:
        "Whenever a character is challenged while here, each opponent chooses and discards a card.",
    },
  ],
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        from: "hand",
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "1w9-1",
      name: "LOST IN THE WAVES",
      text: "LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.",
      trigger: {
        event: "challenged",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: perilousMazeWateryLabyrinthI18n,
};
