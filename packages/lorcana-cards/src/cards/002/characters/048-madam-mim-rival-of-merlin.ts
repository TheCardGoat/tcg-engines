import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimRivalOfMerlin: CharacterCard = {
  id: "dz2",
  cardType: "character",
  name: "Madam Mim",
  version: "Rival of Merlin",
  fullName: "Madam Mim - Rival of Merlin",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Madam Mim.)\nGRUESOME AND GRIM {E} — Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 48,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "325d620e287565d4121f1cd33cb3e2778aa78e65",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   atEndOfTurnBanishItself,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { targetCard } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const madamMimRivalOfMerlin: LorcanitoCharacterCard = {
//   id: "esw",
//   name: "Madam Mim",
//   title: "Rival of Merlin",
//   characteristics: ["floodborn", "sorcerer", "villain"],
//   text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Madam Mim._)\n\n**GRUESOME AND GRIM** {E} − Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _They can challenge the turn they're played._",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "madam mim"),
//     {
//       type: "activated",
//       name: "Gruesome and Grim",
//       text: "{E} − Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _They can challenge the turn they're played._",
//       optional: false,
//       costs: [{ type: "exert" }],
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
//                 comparison: { operator: "lte", value: 4 },
//               },
//             ],
//           },
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               target: targetCard,
//               filters: targetCard.filters,
//               effects: [
//                 {
//                   type: "ability",
//                   ability: "custom",
//                   modifier: "add",
//                   duration: "turn",
//                   customAbility: atEndOfTurnBanishItself,
//                   target: targetCard,
//                 },
//                 {
//                   type: "ability",
//                   ability: "rush",
//                   modifier: "add",
//                   duration: "turn",
//                   target: targetCard,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 2,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Mane Kandalyan / Pix Smith",
//   number: 48,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527737,
//   },
//   rarity: "rare",
// };
//
