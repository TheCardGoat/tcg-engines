import type { CharacterCard } from "@tcg/lorcana-types";

export const olafHelpingHand: CharacterCard = {
  id: "uix",
  cardType: "character",
  name: "Olaf",
  version: "Helping Hand",
  fullName: "Olaf - Helping Hand",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "010",
  text: "SECOND CHANCE When this character leaves play, you may return chosen character of yours to your hand.",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 57,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6e044f7c0be5320c2482b877967fa82a5feec15d",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   LorcanitoCharacterCard,
//   TriggeredAbility,
// } from "@lorcanito/lorcana-engine";
//
// export const olafHelpingHand: LorcanitoCharacterCard = {
//   id: "vlc",
//   name: "Olaf",
//   title: "Helping Hand",
//   characteristics: ["storyborn", "ally"],
//   text: "SECOND CHANCE When this character leaves play, you may return chosen character of yours to your hand.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 2,
//   willpower: 1,
//   illustrator: "Matteo Marzocco",
//   number: 57,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659447,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "static-triggered",
//       name: "SECOND CHANCE",
//       text: "When this character leaves play, you may return chosen character of yours to your hand.",
//       trigger: {
//         on: "leave",
//         target: {
//           type: "card",
//           value: "all",
//           filters: [{ filter: "source", value: "self" }],
//         },
//       },
//       layer: {
//         type: "resolution",
//         optional: true,
//         name: "SECOND CHANCE",
//         text: "When this character leaves play, you may return chosen character of yours to your hand.",
//         effects: [
//           {
//             type: "move",
//             to: "hand",
//             target: {
//               type: "card",
//               value: 1,
//               filters: [
//                 { filter: "type", value: "character" },
//                 { filter: "zone", value: "play" },
//                 { filter: "owner", value: "self" },
//               ],
//             },
//           },
//         ],
//       },
//     } as TriggeredAbility,
//   ],
//   lore: 1,
// };
//
