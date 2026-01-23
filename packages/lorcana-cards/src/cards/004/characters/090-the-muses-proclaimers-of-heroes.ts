import type { CharacterCard } from "@tcg/lorcana-types";

export const theMusesProclaimersOfHeroes: CharacterCard = {
  id: "1x8",
  cardType: "character",
  name: "The Muses",
  version: "Proclaimers of Heroes",
  fullName: "The Muses - Proclaimers of Heroes",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "Ward (Opponents can't choose this character except to challenge.)\nTHE GOSPEL TRUTH Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 90,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f9536062101bef78b378b2a25c8f9677d0a8486b",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverYouPlayASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const theMusesProclaimersOfHeroes: LorcanitoCharacterCard = {
//   id: "sir",
//   missingTestCase: true,
//   name: "The Muses",
//   title: "Proclaimers of Heroes",
//   characteristics: ["storyborn", "ally"],
//   text: "**WARD** _(Opponents can't choose this character except to challenge.)_\n\n**THE GOSPEL TRUTH** Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
//   type: "character",
//   abilities: [
//     wardAbility,
//     wheneverYouPlayASong({
//       name: "The Gospel Truth",
//       text: "Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
//       optional: true,
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
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Brittney Hackett",
//   number: 90,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547727,
//   },
//   rarity: "rare",
// };
//
