import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenFairestOfAll: CharacterCard = {
  id: "1ho",
  cardType: "character",
  name: "The Queen",
  version: "Fairest of All",
  fullName: "The Queen - Fairest of All",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "005",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named The Queen.)\nWard (Opponents can't choose this character except to challenge.)\nREFLECTIONS OF VANITY For each other character named The Queen you have in play, this character gets +1 {L}.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 1,
  cardNumber: 144,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c18044cdeaee089bbfac4cac5d6c3aa8e04a92bd",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "Queen", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   shiftAbility,
//   wardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const theQueenFairestOfAll: LorcanitoCharacterCard = {
//   id: "de9",
//   name: "The Queen",
//   title: "Fairest of All",
//   characteristics: ["floodborn", "queen", "sorcerer", "villain"],
//   text: "**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named The Queen.)_ **Ward** _(Opponents can’t choose this character except to challenge.)_\n \n**REFLECTIONS OF VANITY** For each other character named The Queen you have in play, this character gets +1 {L}.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "The Queen"),
//     wardAbility,
//     {
//       type: "static",
//       ability: "effects",
//       name: "REFLECTIONS OF VANITY",
//       text: "For each other character named The Queen you have in play, this character gets +1 {L}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: {
//             dynamic: true,
//             excludeSelf: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               {
//                 filter: "attribute",
//                 value: "name",
//                 comparison: { operator: "eq", value: "The Queen" },
//               },
//               { filter: "zone", value: "play" },
//             ],
//           },
//           modifier: "add",
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 2,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Aisha Durmagambetova",
//   number: 144,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561967,
//   },
//   rarity: "super_rare",
// };
//
