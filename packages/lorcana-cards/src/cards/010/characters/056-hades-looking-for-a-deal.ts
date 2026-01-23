import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesLookingForADeal: CharacterCard = {
  id: "qkg",
  cardType: "character",
  name: "Hades",
  version: "Looking for a Deal",
  fullName: "Hades - Looking for a Deal",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "010",
  text: "WHAT D'YA SAY? When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character’s player puts that card on the bottom of their deck.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 56,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5fc0be984dd21402aaebd373ad483414e949646f",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const hadesLookingForADeal: LorcanitoCharacterCard = {
//   id: "hes",
//   name: "Hades",
//   title: "Looking for a Deal",
//   characteristics: ["storyborn", "villain", "deity"],
//   text: "WHAT D'YA SAY? When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character's player puts that card on the bottom of their deck.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Javi Salas",
//   number: 56,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658329,
//   },
//   rarity: "legendary",
//   lore: 1,
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "WHAT D'YA SAY?",
//       text: "When you play this character, you may choose an opposing character. If you do, draw 2 cards unless that character's player puts that card on the bottom of their deck.",
//       optional: true,
//       effects: [
//         {
//           type: "create-layer-based-on-target",
//           target: chosenOpposingCharacter,
//           replaceEffectTarget: true,
//           responder: "opponent",
//           effects: [
//             {
//               type: "modal",
//               target: chosenOpposingCharacter,
//               modes: [
//                 {
//                   id: "1",
//                   // %s will be replaced by card's name on the UI
//                   text: "Put %s that character on the bottom of their deck",
//                   effects: [
//                     {
//                       type: "move",
//                       to: "deck",
//                       bottom: true,
//                       target: {
//                         type: "card",
//                         value: 1,
//                         filters: [{ filter: "source", value: "target" }],
//                       },
//                     },
//                   ],
//                 },
//                 {
//                   id: "2",
//                   text: "Your Opponent Draws 2 Cards.",
//                   effects: [
//                     {
//                       type: "draw",
//                       amount: 2,
//                       target: {
//                         type: "player",
//                         value: "self",
//                       },
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     }),
//   ],
// };
//
