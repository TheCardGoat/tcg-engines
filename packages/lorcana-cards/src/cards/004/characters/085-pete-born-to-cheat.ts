import type { CharacterCard } from "@tcg/lorcana-types";

export const peteBornToCheat: CharacterCard = {
  id: "d6v",
  cardType: "character",
  name: "Pete",
  version: "Born to Cheat",
  fullName: "Pete - Born to Cheat",
  inkType: ["emerald"],
  set: "004",
  text: "I CLOBBER YOU! Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 85,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2f8a8a1f35e467578c986936eff493b9b875b067",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Musketeer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const peteBornToCheat: LorcanitoCharacterCard = {
//   id: "fqb",
//   missingTestCase: true,
//   name: "Pete",
//   title: "Born to Cheat",
//   characteristics: ["dreamborn", "villain", "musketeer"],
//   text: "**I CLOBBER YOU!** Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "I Clobber You!",
//       text: "Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
//       conditions: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           comparison: { operator: "gte", value: 5 },
//         },
//       ],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 filter: "attribute",
//                 value: "strength",
//                 comparison: { operator: "lte", value: 2 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   colors: ["emerald"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Carlos Luzzi",
//   number: 85,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550580,
//   },
//   rarity: "super_rare",
// };
//
