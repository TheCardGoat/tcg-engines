import type { CharacterCard } from "@tcg/lorcana-types";

export const chernabogCreatureOfTheNight: CharacterCard = {
  id: "1x1",
  cardType: "character",
  name: "Chernabog",
  version: "Creature of the Night",
  fullName: "Chernabog - Creature of the Night",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "007",
  text: "MIDNIGHT REVEL When you play this character, each opponent chooses and exerts one of their ready characters. They can't ready at the start of their next turn.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 1,
  cardNumber: 50,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f8c82e67f89c9ff310443e3e85dd847673575b7e",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { exertAndCantReadyAtTheeStartOfTheirTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const chernabogCreatureOfTheNight: LorcanitoCharacterCard = {
//   id: "olc",
//   name: "Chernabog",
//   title: "Creature of the Night",
//   characteristics: ["storyborn", "villain"],
//   text: "MIDNIGHT Revel When you play this character, each opponent chooses and exerts one of their ready characters. They can't ready at the start of their next turn..",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "",
//       text: "",
//       responder: "opponent",
//       effects: exertAndCantReadyAtTheeStartOfTheirTurn({
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           { filter: "status", value: "ready" },
//         ],
//       }),
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 2,
//   willpower: 6,
//   illustrator: "Giulia Riva",
//   number: 50,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619433,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
