import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesFastTalker: CharacterCard = {
  id: "1px",
  cardType: "character",
  name: "Hades",
  version: "Fast Talker",
  fullName: "Hades - Fast Talker",
  inkType: ["amethyst", "ruby"],
  franchise: "Hercules",
  set: "007",
  text: "FOR JUST A LITTLE PAIN When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 52,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "df2b712163f2278bdb5a2b67b13b5d5e3e04e6d4",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const hadesFastTalker: LorcanitoCharacterCard = {
//   id: "ye4",
//   name: "Hades",
//   title: "Fast Talker",
//   characteristics: ["storyborn", "villain", "deity"],
//   text: "FOR JUST A LITTLE PAIN When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.",
//   type: "character",
//   abilities: [
//     whenYouPlayThis({
//       name: "FOR JUST A LITTLE PAIN",
//       text: "When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.",
//       optional: true,
//       dependentEffects: true,
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenCharacterOfYours,
//         },
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 3 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst", "ruby"],
//   cost: 6,
//   strength: 4,
//   willpower: 6,
//   illustrator: "Cristian Romero",
//   number: 52,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618133,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
