import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaVoiceStealer: CharacterCard = {
  id: "19w",
  cardType: "character",
  name: "Ursula",
  version: "Voice Stealer",
  fullName: "Ursula - Voice Stealer",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "009",
  text: "SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 44,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a56b1e5ceac728acb2ec90212fecc0118d4e568f",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenOpposingReadyCharacter,
//   thisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const ursulaVoiceStealer: LorcanitoCharacterCard = {
//   id: "mkd",
//   name: "Ursula",
//   title: "Voice Stealer",
//   characteristics: ["storyborn", "villain", "sorcerer"],
//   text: "SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Max Ulichney",
//   number: 44,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649991,
//   },
//   rarity: "super_rare",
//   abilities: [
//     whenYouPlayThis({
//       optional: true,
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: chosenOpposingReadyCharacter,
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               target: thisCharacter,
//               optional: true,
//               effects: [
//                 {
//                   type: "play",
//                   forFree: true,
//                   target: {
//                     type: "card",
//                     value: 1,
//                     filters: [
//                       { filter: "owner", value: "self" },
//                       { filter: "zone", value: "hand" },
//                       { filter: "characteristics", value: ["song"] },
//                       {
//                         filter: "attribute",
//                         value: "cost",
//                         compareWithParentsTarget: true,
//                         comparison: { operator: "lte", value: "target" },
//                       },
//                     ],
//                   },
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
