import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodTimelyContestant: CharacterCard = {
  id: "jfv",
  cardType: "character",
  name: "Robin Hood",
  version: "Timely Contestant",
  fullName: "Robin Hood - Timely Contestant",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  text: "TAG ME IN! For each 1 damage on opposing characters, you pay 1 {I} less to play this character.\nWard (Opponents can't choose this character except to challenge.)",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 4,
  cardNumber: 69,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "46113126c7bad0cd90cc18033e9413118fc1ccb1",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const robinHoodTimelyContestant: LorcanitoCharacterCard = {
//   id: "abw",
//   name: "Robin Hood",
//   title: "Timely Contestant",
//   characteristics: ["hero", "storyborn"],
//   text: "**TAG ME IN!** For each 1 damage on opposing characters, you pay 1 {I} less to play this character. **Ward** _(Opponents can’t choose this character except to challenge.)_",
//   type: "character",
//   abilities: [
//     whenYouPlayThisForEachYouPayLess({
//       name: "Tag me in!",
//       text: "For each 1 damage on opposing characters, you pay 1 {I} less to play this character.",
//       amount: {
//         dynamic: true,
//         targetFilterReducer: "damage",
//         filters: [
//           { filter: "owner", value: "opponent" },
//           { filter: "type", value: "character" },
//           {
//             filter: "status",
//             value: "damage",
//             comparison: { operator: "gte", value: 1 },
//           },
//         ],
//       },
//     }),
//     wardAbility,
//   ],
//   colors: ["emerald"],
//   cost: 9,
//   strength: 6,
//   willpower: 6,
//   lore: 4,
//   illustrator: "James Rey Sanchez",
//   number: 69,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 557730,
//   },
//   rarity: "rare",
// };
//
