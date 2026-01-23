import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnGoldLover: CharacterCard = {
  id: "1b5",
  cardType: "character",
  name: "Prince John",
  version: "Gold Lover",
  fullName: "Prince John - Gold Lover",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "005",
  text: "BEAUTIFUL, LOVELY TAXES {E} — Play an item from your hand or discard with cost 5 or less for free, exerted.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 147,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a9c072cf5b48edda82d051442b832712beead027",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const princeJohnGoldLover: LorcanitoCharacterCard = {
//   id: "vxl",
//   missingTestCase: true,
//   name: "Prince John",
//   title: "Gold Lover",
//   characteristics: ["storyborn", "villain", "prince"],
//   text: "**BEAUTIFUL, LOVELY TAXES** {E} – Play an item from your hand or discard with cost 5 or less for free, exerted.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "**BEAUTIFUL, LOVELY TAXES** ",
//       text: "{E} – Play an item from your hand or discard with cost 5 or less for free, exerted.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "play",
//           forFree: true,
//           exerted: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: ["discard", "hand"] },
//               { filter: "type", value: "item" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 5 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "A villainous schemer from day to night.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Koni",
//   number: 147,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 556439,
//   },
//   rarity: "super_rare",
// };
//
