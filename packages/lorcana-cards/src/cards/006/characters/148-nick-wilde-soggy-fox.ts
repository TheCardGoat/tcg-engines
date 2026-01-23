import type { CharacterCard } from "@tcg/lorcana-types";

export const nickWildeSoggyFox: CharacterCard = {
  id: "10j",
  cardType: "character",
  name: "Nick Wilde",
  version: "Soggy Fox",
  fullName: "Nick Wilde - Soggy Fox",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "006",
  text: "NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 148,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "83b82508f808e3474f91baaf49efd065f71a2820",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const nickWildeSoggyFox: LorcanitoCharacterCard = {
//   id: "odz",
//   missingTestCase: true,
//   name: "Nick Wilde",
//   title: "Soggy Fox",
//   characteristics: ["storyborn", "ally"],
//   text: "NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "Nice To Have A Partner",
//       text: "While you have another character with Support in play, this character gets +2 {S}.",
//       attribute: "strength",
//       amount: 2,
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "owner", value: "self" },
//             {
//               filter: "type",
//               value: "character",
//             },
//             {
//               filter: "zone",
//               value: "play",
//             },
//             {
//               filter: "ability",
//               value: "support",
//             },
//           ],
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Lauren Barger",
//   number: 148,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 579927,
//   },
//   rarity: "common",
// };
//
