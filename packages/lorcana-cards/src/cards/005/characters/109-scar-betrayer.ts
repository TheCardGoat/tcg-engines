import type { CharacterCard } from "@tcg/lorcana-types";

export const scarBetrayer: CharacterCard = {
  id: "1rc",
  cardType: "character",
  name: "Scar",
  version: "Betrayer",
  fullName: "Scar - Betrayer",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "005",
  text: "LONG LIVE THE KING When you play this character, you may banish chosen character named Mufasa.",
  cost: 5,
  strength: 6,
  willpower: 3,
  lore: 2,
  cardNumber: 109,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e32abffa68664089a138943286790c91aa3b29ed",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const scarBetrayer: LorcanitoCharacterCard = {
//   id: "yvg",
//   name: "Scar",
//   title: "Betrayer",
//   characteristics: ["storyborn", "villain"],
//   text: "**LONG LIVE THE KING** When you play this character, you may banish chosen character named Mufasa.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "**LONG LIVE THE KING**",
//       text: "When you play this character, you may banish chosen character named Mufasa.",
//       optional: true,
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "attribute",
//                 value: "name",
//                 comparison: { operator: "eq", value: "Mufasa" },
//               },
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "The second Rule of Villainy: Never settle for second place.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 6,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Dinulescu Alexandru",
//   number: 109,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561962,
//   },
//   rarity: "uncommon",
// };
//
