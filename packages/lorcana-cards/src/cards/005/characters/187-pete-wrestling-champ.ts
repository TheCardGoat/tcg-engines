import type { CharacterCard } from "@tcg/lorcana-types";

export const peteWrestlingChamp: CharacterCard = {
  id: "pvv",
  cardType: "character",
  name: "Pete",
  version: "Wrestling Champ",
  fullName: "Pete - Wrestling Champ",
  inkType: ["steel"],
  set: "005",
  text: "RE-PETE {E} - Reveal the top card of your deck. If it's a character card named Pete, you may play it for free.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 187,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5d4ac7161bfe7af9982b72789e53ee2a506ae7bf",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const peteWrestlingChamp: LorcanitoCharacterCard = {
//   id: "uuo",
//   name: "Pete",
//   title: "Wrestling Champ",
//   characteristics: ["dreamborn", "villain"],
//   text: "**RE-PETE** {E} - Reveal the top card of your deck. If it’s a character card named Pete, you may play it for free.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "Re-Pete",
//       text: "{E} - Reveal the top card of your deck. If it’s a character card named Pete, you may play it for free.",
//       costs: [{ type: "exert" }],
//       // TODO: Adding optional here breaks the engine, as it will ask players to accept the effect twicee (onee for the reveael and another for the play)
//       // optional: true,
//       effects: [
//         {
//           type: "reveal-and-play",
//           putInto: "deck",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//               {
//                 filter: "attribute",
//                 value: "name",
//                 comparison: { operator: "eq", value: "Pete" },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "He’ll have you seeing double.",
//   colors: ["steel"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Rianti Hidayat",
//   number: 187,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559085,
//   },
//   rarity: "rare",
// };
//
