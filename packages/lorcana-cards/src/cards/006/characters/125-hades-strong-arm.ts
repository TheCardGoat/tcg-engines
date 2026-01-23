import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesStrongArm: CharacterCard = {
  id: "lyw",
  cardType: "character",
  name: "Hades",
  version: "Strong Arm",
  fullName: "Hades - Strong Arm",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "006",
  text: "WHAT ARE YOU GONNA DO? {E}, 3 {I}, Banish one of your characters – Banish chosen character.",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 125,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4f2dc7d36ef87536973bed84cbfe5735a853a3dd",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { banishChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const hadesStrongArm: LorcanitoCharacterCard = {
//   id: "q4o",
//   name: "Hades",
//   title: "Strong Arm",
//   characteristics: ["storyborn", "villain", "deity"],
//   text: "WHAT ARE YOU GONNA DO? {E}, 3 {I}, Banish one of your characters – Banish chosen character.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       costs: [
//         { type: "exert" },
//         { type: "ink", amount: 3 },
//         {
//           type: "card",
//           action: "banish",
//           amount: 1,
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//             { filter: "type", value: "character" },
//           ],
//         },
//       ],
//       name: "What Are You Gonna Do?",
//       text: "Banish chosen character.",
//       effects: [banishChosenCharacter],
//     },
//   ],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 4,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Brian Kesinger",
//   number: 125,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588070,
//   },
//   rarity: "legendary",
// };
//
