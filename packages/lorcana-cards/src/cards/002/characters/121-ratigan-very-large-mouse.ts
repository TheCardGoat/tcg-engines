import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganVeryLargeMouse: CharacterCard = {
  id: "1wj",
  cardType: "character",
  name: "Ratigan",
  version: "Very Large Mouse",
  fullName: "Ratigan - Very Large Mouse",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "THIS IS MY KINGDOM When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 121,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f70a88424f6eced04d922558f866b8c6a4774eed",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { anotherChosenCharOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ratiganVeryLargeMouse: LorcanitoCharacterCard = {
//   id: "vl3",
//   name: "Ratigan",
//   title: "Very Large Mouse",
//   characteristics: ["storyborn", "villain"],
//   text: "**THIS IS MY KINGDOM** When you play this character, exert chosen opposing character with 3 {S} or less. Chose one of your characters and ready them. They can't quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "This Is My Kingdom",
//       text: "When you play this character, chose one of your characters and ready them. They can't quest for the rest of this turn.",
//       effects: readyAndCantQuest(anotherChosenCharOfYours),
//     },
//     {
//       type: "resolution",
//       name: "This Is My Kingdom",
//       text: "When you play this character, exert chosen opposing character with 3 {S} or less.",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//               {
//                 filter: "attribute",
//                 value: "strength",
//                 comparison: { operator: "lte", value: 3 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "This time, nothing, not even Basil, can stand in my way!",
//   colors: ["ruby"],
//   cost: 5,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Valerio Buonfantino",
//   number: 121,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527276,
//   },
//   rarity: "rare",
// };
//
