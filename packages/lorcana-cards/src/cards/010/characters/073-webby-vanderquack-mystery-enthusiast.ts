import type { CharacterCard } from "@tcg/lorcana-types";

export const webbyVanderquackMysteryEnthusiast: CharacterCard = {
  id: "1kd",
  cardType: "character",
  name: "Webby Vanderquack",
  version: "Mystery Enthusiast",
  fullName: "Webby Vanderquack - Mystery Enthusiast",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "CONTAGIOUS ENERGY When you play this character, chosen character gets +1 {S} this turn.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 73,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cb242024f4792a7b34ea392bfe4dd7009f475856",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const webbyVanderquackMysteryEnthusiast: LorcanitoCharacterCard = {
//   id: "jx5",
//   name: "Webby Vanderquack",
//   title: "Mystery Enthusiast",
//   characteristics: ["storyborn", "ally"],
//   text: "CONTAGIOUS ENERGY When you play this character, chosen character gets +1 {S} this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Rosa la Barbera / Livio Cacciatore",
//   number: 73,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658465,
//   },
//   rarity: "common",
//   lore: 1,
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "CONTAGIOUS ENERGY",
//       text: "When you play this character, chosen character gets +1 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           modifier: "add",
//           amount: 1,
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
// };
//
