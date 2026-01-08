import type { ActionCard } from "@tcg/lorcana-types";

export const suddenScare: ActionCard = {
  id: "1jz",
  cardType: "action",
  name: "Sudden Scare",
  inkType: ["sapphire"],
  set: "010",
  text: "Put chosen opposing character into their player's inkwell facedown. That player puts the top card of their deck into their inkwell facedown.",
  cost: 4,
  cardNumber: 164,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c9c19bc296c45f9f2cf3a8a71eb66d92d93fab92",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { putTopCardOfOpponentDeckIntoTheirInkwell } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const suddenScare: LorcanitoActionCard = {
//   id: "e24",
//   name: "Sudden Scare",
//   characteristics: ["action"],
//   text: "Put chosen opposing character into their player's inkwell facedown. That player puts the top card of their deck into their inkwell facedown.",
//   type: "action",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   illustrator: "Federico Maria Cugliari",
//   number: 164,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660039,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Sudden Scare",
//       text: "Put chosen opposing character into their player's inkwell facedown. That player puts the top card of their deck into their inkwell facedown.",
//       resolveEffectsIndividually: true,
//       dependentEffects: true,
//       effects: [
//         putTopCardOfOpponentDeckIntoTheirInkwell,
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     },
//   ],
// };
//
