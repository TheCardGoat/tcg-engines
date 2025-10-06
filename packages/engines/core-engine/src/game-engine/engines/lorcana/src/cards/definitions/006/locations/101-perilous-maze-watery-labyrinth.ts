import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";

export const perilousMazeWateryLabyrinth: LorcanaLocationCardDefinition = {
  id: "jrf",
  name: "Perilous Maze",
  title: "Watery Labyrinth",
  characteristics: ["location"],
  text: "LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "Lost In The Waves",
      text: "Whenever a character is challenged while here, each opponent chooses and discards a card.",
      ability: whenChallenged({
        name: "Lost In The Waves",
        text: "Whenever a character is challenged while here, each opponent chooses and discards a card.",
        responder: "opponent",
        effects: [discardACard],
      }),
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  willpower: 8,
  lore: 1,
  moveCost: 1,
  illustrator: "Matthew Oates",
  number: 101,
  set: "006",
  rarity: "common",
};
