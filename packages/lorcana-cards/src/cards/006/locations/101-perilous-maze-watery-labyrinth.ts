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
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f81280fd57b41193ef1b6c791b142bd584a2a840",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenChallenged } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const perilousMazeWateryLabyrinth: LorcanitoLocationCard = {
//   id: "jrf",
//   name: "Perilous Maze",
//   title: "Watery Labyrinth",
//   characteristics: ["location"],
//   text: "LOST IN THE WAVES Whenever a character is challenged while here, each opponent chooses and discards a card.",
//   type: "location",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "Lost In The Waves",
//       text: "Whenever a character is challenged while here, each opponent chooses and discards a card.",
//       ability: whenChallenged({
//         name: "Lost In The Waves",
//         text: "Whenever a character is challenged while here, each opponent chooses and discards a card.",
//         responder: "opponent",
//         effects: [discardACard],
//       }),
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   willpower: 8,
//   lore: 1,
//   moveCost: 1,
//   illustrator: "Matthew Oates",
//   number: 101,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592027,
//   },
//   rarity: "common",
// };
//
