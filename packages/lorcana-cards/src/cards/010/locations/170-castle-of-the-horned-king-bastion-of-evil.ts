import type { LocationCard } from "@tcg/lorcana-types";

export const castleOfTheHornedKingBastionOfEvil: LocationCard = {
  id: "lzh",
  cardType: "location",
  name: "Castle of the Horned King",
  version: "Bastion of Evil",
  fullName: "Castle of the Horned King - Bastion of Evil",
  inkType: ["sapphire"],
  franchise: "Black Cauldron",
  set: "010",
  text: "INTO THE GLOOM Once during your turn, whenever a character quests while here, you may ready chosen item.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 170,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4f3cc788deedfccf111e074d5d5bc60576136b83",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { wheneverACharacterQuestsWhileHere } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { readyChosenItem } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const castleOfTheHornedKingBastionOfEvil: LorcanitoLocationCard = {
//   id: "yva",
//   name: "Castle of the Horned King",
//   title: "Bastion of Evil",
//   characteristics: ["location"],
//   text: "INTO THE GLOOM Once during your turn, whenever a character quests while here, you may ready chosen item.",
//   type: "location",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   willpower: 5,
//   illustrator: "Alyssa Lee",
//   number: 170,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659603,
//   },
//   rarity: "rare",
//   abilities: [
//     wheneverACharacterQuestsWhileHere({
//       name: "INTO THE GLOOM",
//       text: "Once during your turn, whenever a character quests while here, you may ready chosen item.",
//       optional: true,
//       effects: [readyChosenItem],
//     }),
//   ],
//   moveCost: 1,
//   lore: 0,
// };
//
