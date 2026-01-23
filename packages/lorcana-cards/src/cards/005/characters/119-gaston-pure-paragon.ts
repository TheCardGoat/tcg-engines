import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonPureParagon: CharacterCard = {
  id: "z5u",
  cardType: "character",
  name: "Gaston",
  version: "Pure Paragon",
  fullName: "Gaston - Pure Paragon",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "005",
  text: "A MAN AMONG MEN! For each damaged character you have in play, you pay 2 {I} less to play this character.\nRush (This character can challenge the turn they're played.)",
  cost: 9,
  strength: 10,
  willpower: 6,
  lore: 2,
  cardNumber: 119,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7eba1c3fb054cfff5aef1939f5af90cdc29a1977",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const gastonPureParagon: LorcanitoCharacterCard = {
//   id: "pzz",
//   name: "Gaston",
//   title: "Pure Paragon",
//   characteristics: ["dreamborn", "villain"],
//   text: "**A MAN AMONG MEN!** For each damaged character you have in play, you pay 2 {I} less to play this character.<br/>**Rush** _(This character can challenge the turn they're played.)_",
//   type: "character",
//   abilities: [
//     rushAbility,
//     whenYouPlayThisForEachYouPayLess({
//       name: "A Man among men",
//       text: "For each damaged character you have in play, you pay 2 {I} less to play this character.",
//       amount: {
//         dynamic: true,
//         filterMultiplier: 2,
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "status", value: "damaged" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//         ],
//       },
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 9,
//   strength: 10,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Dave Alvarez / Livio Ramondelli",
//   number: 119,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560542,
//   },
//   rarity: "rare",
// };
//
