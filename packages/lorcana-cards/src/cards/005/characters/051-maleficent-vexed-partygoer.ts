import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentVexedPartygoer: CharacterCard = {
  id: "1ib",
  cardType: "character",
  name: "Maleficent",
  version: "Vexed Partygoer",
  fullName: "Maleficent - Vexed Partygoer",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "005",
  text: "WHAT AN AWKWARD SITUATION Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player's hand.",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 2,
  cardNumber: 51,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c3436e71471bedffbf745dff08472a9567ae7c90",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const maleficentVexedPartygoer: LorcanitoCharacterCard = {
//   id: "ejq",
//   missingTestCase: true,
//   name: "Maleficent",
//   title: "Vexed Partygoer",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**WHAT AN AWKWARD SITUATION** Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player’s hand.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "WHAT AN AWKWARD SITUATION",
//       text: "Whenever this character quests, you may choose and discard a card to return chosen character, item, or location with cost 3 or less to their player’s hand.",
//       optional: true,
//       dependentEffects: true,
//       effects: [
//         {
//           type: "discard",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//             ],
//           },
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               target: thisCharacter,
//               effects: [
//                 {
//                   type: "move",
//                   to: "hand",
//                   target: {
//                     type: "card",
//                     value: 1,
//                     filters: [
//                       {
//                         filter: "attribute",
//                         value: "cost",
//                         comparison: { operator: "lte", value: 3 },
//                       },
//                       {
//                         filter: "type",
//                         value: ["character", "item", "location"],
//                       },
//                       { filter: "zone", value: "play" },
//                       // { filter: "owner", value: "self" },
//                     ],
//                   },
//                 },
//               ],
//             },
//           ],
//         } /*,
//          */,
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   willpower: 4,
//   strength: 0,
//   lore: 2,
//   illustrator: "Carlos Gomes Cabral",
//   number: 51,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561614,
//   },
//   rarity: "uncommon",
// };
//
