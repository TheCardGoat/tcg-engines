import type { CharacterCard } from "@tcg/lorcana-types";

export const kronkHeadOfSecurity: CharacterCard = {
  id: "156",
  cardType: "character",
  name: "Kronk",
  version: "Head of Security",
  fullName: "Kronk - Head of Security",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Kronk.)\nARE YOU ON THE LIST? During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 1,
  cardNumber: 185,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "94767179059f954952263718c06a54472353a854",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const kronkHeadOfSecurity: LorcanitoCharacterCard = {
//   id: "y86",
//   missingTestCase: true,
//   name: "Kronk",
//   title: "Head of Security",
//   characteristics: ["floodborn", "captain", "ally"],
//   text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Kronk.)_ **ARE YOU ON THE LIST?** During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "Kronk"),
//     wheneverBanishesAnotherCharacterInChallenge({
//       name: "ARE YOU ON THE LIST?",
//       text: "During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.",
//       optional: true,
//       effects: [
//         {
//           type: "play",
//           forFree: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//               { filter: "type", value: "character" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 5 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   colors: ["steel"],
//   cost: 7,
//   strength: 6,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Nicholas Kole",
//   number: 185,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555273,
//   },
//   rarity: "super_rare",
// };
//
