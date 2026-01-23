import type { CharacterCard } from "@tcg/lorcana-types";

export const wendyDarlingCourageousCaptain: CharacterCard = {
  id: "1dv",
  cardType: "character",
  name: "Wendy Darling",
  version: "Courageous Captain",
  fullName: "Wendy Darling - Courageous Captain",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLOOK LIVELY, CREW! While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 108,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b3be12a2703c95466d26dd17ba82bd3145cfbfd8",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const wendyDarlingCourageousCaptain: LorcanitoCharacterCard = {
//   id: "mxj",
//   name: "Wendy Darling",
//   title: "Courageous Captain",
//   characteristics: ["dreamborn", "hero", "pirate", "captain"],
//   text: "Evasive (Only characters with Evasive can challenge this character.)\nLOOK LIVELY, CREW! While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     {
//       type: "static",
//       ability: "effects",
//       name: "Look Lively, Crew!",
//       text: "While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.",
//       conditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 2 },
//           filters: [
//             { filter: "characteristics", value: ["pirate"] },
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//           ],
//         },
//       ],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "add",
//           target: thisCharacter,
//         },
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "French Carlomagno / Mariana Moreno",
//   number: 108,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 582540,
//   },
//   rarity: "rare",
// };
//
