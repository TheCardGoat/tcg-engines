import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderHisOwnBiggestFan: CharacterCard = {
  id: "11r",
  cardType: "character",
  name: "Flynn Rider",
  version: "His Own Biggest Fan",
  fullName: "Flynn Rider - His Own Biggest Fan",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Flynn Rider.)\nEvasive (Only characters with Evasive can challenge this character.)\nONE LAST, BIG SCORE This character gets -1 {L} for each card in your opponents' hands.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 4,
  cardNumber: 82,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8812a7f3b2b166bdddc6961bfc5a2b1a783b1d51",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const flynnRiderHisOwnBiggestFan: LorcanitoCharacterCard = {
//   id: "t36",
//
//   name: "Flynn Rider",
//   title: "His Own Biggest Fan",
//   characteristics: ["hero", "floodborn", "prince"],
//   text: "**Shift** 2 _You may pay 2 {I} to play this on top of one of your characters named Flynn Rider.)_\n\n**Evasive** (_Only characters with Evasive can challenge this character._)\n\n**ONE LAST, BIG SCORE** This character gets -1 {L} for each card in your opponents' hands.",
//   type: "character",
//   abilities: [
//     shiftAbility(2, "flynn rider"),
//     evasiveAbility,
//     {
//       type: "static",
//       ability: "effects",
//       name: "One Last, Big Score",
//       text: "This character gets -1 {L} for each card in your opponents' hands.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           modifier: "subtract",
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     },
//   ],
//   colors: ["emerald"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   lore: 4,
//   illustrator: "E. Meleranci / L. Giammichele",
//   number: 82,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527178,
//   },
//   rarity: "rare",
// };
//
