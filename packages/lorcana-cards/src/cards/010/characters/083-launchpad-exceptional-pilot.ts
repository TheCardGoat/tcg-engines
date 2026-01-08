import type { CharacterCard } from "@tcg/lorcana-types";

export const launchpadExceptionalPilot: CharacterCard = {
  id: "m1r",
  cardType: "character",
  name: "Launchpad",
  version: "Exceptional Pilot",
  fullName: "Launchpad - Exceptional Pilot",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "OFF THE MAP When you play this character, you may banish chosen location.",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 83,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4f77725589536ddc85294a41b48dcd409ec34d34",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const launchpadExceptionalPilot: LorcanitoCharacterCard = {
//   id: "g4q",
//   name: "Launchpad",
//   title: "Exceptional Pilot",
//   characteristics: ["storyborn", "ally"],
//   text: "OFF THE MAP When you play this character, you may banish chosen location.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Aristeidis Zentelis",
//   number: 83,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658464,
//   },
//   rarity: "common",
//   lore: 1,
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "OFF THE MAP",
//       text: "When you play this character, you may banish chosen location.",
//       optional: true,
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "location" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
