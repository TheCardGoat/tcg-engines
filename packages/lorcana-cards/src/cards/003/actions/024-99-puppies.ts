import type { ActionCard } from "@tcg/lorcana-types";

export const _99Puppies: ActionCard = {
  id: "q5l",
  cardType: "action",
  name: "99 Puppies",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "003",
  text: "Whenever one of your characters quests this turn, gain 1 lore.",
  cost: 5,
  cardNumber: 24,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5e43d8ea46210ff6a851a826904c6a9136ea4936",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoActionCard,
//   LoreEffect,
//   Trigger,
// } from "@lorcanito/lorcana-engine";
// import {
//   oneOfYourCharacters,
//   self,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const NnPuppies: LorcanitoActionCard = {
//   id: "cba",
//   name: "99 Puppies",
//   characteristics: ["action"],
//   text: "Whenever one of your characters quests this turn, gain 1 lore.",
//   type: "action",
//   abilities: [
//     {
//       type: "floating-triggered",
//       duration: "turn",
//       trigger: {
//         on: "quest",
//         target: oneOfYourCharacters,
//       } as Trigger,
//       layer: {
//         type: "resolution",
//         effects: [
//           {
//             type: "lore",
//             amount: 1,
//             modifier: "add",
//             target: self,
//           } as LoreEffect,
//         ],
//       },
//     },
//   ],
//   flavour: "Two, four, six, and three is nine, plus two is 11 . . . \n−Roger",
//   colors: ["amber"],
//   cost: 5,
//   illustrator: "Agnes Christianson",
//   number: 24,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 534480,
//   },
//   rarity: "uncommon",
// };
//
