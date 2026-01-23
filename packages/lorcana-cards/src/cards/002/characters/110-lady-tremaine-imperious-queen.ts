import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineImperiousQueen: CharacterCard = {
  id: "1ir",
  cardType: "character",
  name: "Lady Tremaine",
  version: "Imperious Queen",
  fullName: "Lady Tremaine - Imperious Queen",
  inkType: ["ruby"],
  franchise: "Cinderella",
  set: "002",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Lady Tremaine.)\nPOWER TO RULE AT LAST When you play this character, each opponent chooses and banishes one of their characters.",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 110,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c555de0cc0c5618aef6420094f6b4d9e52c30313",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const ladyTremaineImperiousQueen: LorcanitoCharacterCard = {
//   id: "m9y",
//
//   name: "Lady Tremaine",
//   title: "Imperious Queen",
//   characteristics: ["floodborn", "queen", "villain"],
//   text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Lady Tremaine.)_<br>\n**POWER TO RULE AT LAST** When you play this character, each opponent chooses and banishes one of their characters.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "lady tremaine"),
//     {
//       type: "resolution",
//       name: "Power to Rule at Last",
//       text: "When you play this character, each opponent chooses and banishes one of their characters.",
//       responder: "opponent",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour:
//     "The twelfth Rule of Villainy: If you don't have a throne, take one.",
//   colors: ["ruby"],
//   cost: 6,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Arianna Rea",
//   number: 110,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527756,
//   },
//   rarity: "super_rare",
// };
//
