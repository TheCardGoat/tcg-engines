import type { CharacterCard } from "@tcg/lorcana-types";

export const buckySquirrelSqueakTutor: CharacterCard = {
  id: "tzh",
  cardType: "character",
  name: "Bucky",
  version: "Squirrel Squeak Tutor",
  fullName: "Bucky - Squirrel Squeak Tutor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "002",
  text: "SQUEAK Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 73,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6c124f28a9b74875d11667138240e90833dbd228",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverYouPlayAFloodBorn } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const buckySquirrelSqueakTutor: LorcanitoCharacterCard = {
//   id: "aci",
//   name: "Bucky",
//   title: "Squirrel Squeak Tutor",
//   characteristics: ["storyborn", "ally"],
//   text: "**SQUEAK** Whenever you play a Floodborn character, each opponent chooses and discards a card. à Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayAFloodBorn({
//       name: "Squeak",
//       text: "Whenever you play a Floodborn character, each opponent chooses and discards a card. à Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
//       responder: "opponent",
//       hasShifted: true,
//       effects: [
//         {
//           type: "discard",
//           amount: 1,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: '"There\'s a lot of nuance to squirrel."\n−Kronk',
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 1,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Alex Accorsi",
//   number: 73,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 597095,
//   },
//   rarity: "uncommon",
// };
//
