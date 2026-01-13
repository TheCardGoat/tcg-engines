import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSmeeCaptainOfTheJollyRoger: CharacterCard = {
  id: "1wp",
  cardType: "character",
  name: "Mr. Smee",
  version: "Captain of the Jolly Roger",
  fullName: "Mr. Smee - Captain of the Jolly Roger",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mr. Smee.)\nRAISE THE COLORS When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 176,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f79d27f85394475fadaea68266df26fd8324d52f",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const mrSmeeCaptainOfTheJollyRoger: LorcanitoCharacterCard = {
//   id: "ebn",
//   missingTestCase: true,
//   name: "Mr. Smee",
//   title: "Captain of the Jolly Roger",
//   characteristics: ["floodborn", "villain", "pirate", "captain"],
//   text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mr. Smee.)\nRAISE THE COLORS When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Mr. Smee"),
//     {
//       type: "resolution",
//       name: "Raise the Colors",
//       text: "When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.",
//       effects: [
//         {
//           type: "damage",
//           target: chosenCharacter,
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "characteristics", value: ["pirate"] },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 6,
//   strength: 3,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Grace Tran",
//   number: 176,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592004,
//   },
//   rarity: "super_rare",
// };
//
