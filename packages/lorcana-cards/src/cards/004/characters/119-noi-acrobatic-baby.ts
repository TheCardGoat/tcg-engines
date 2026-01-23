import type { CharacterCard } from "@tcg/lorcana-types";

export const noiAcrobaticBaby: CharacterCard = {
  id: "tbx",
  cardType: "character",
  name: "Noi",
  version: "Acrobatic Baby",
  fullName: "Noi - Acrobatic Baby",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  text: "FANCY FOOTWORK Whenever you play an action, this character takes no damage from challenges this turn.",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 119,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "69b64d6c86e48d0521e82b7d4d61a7e5bb3763ad",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const noiAcrobaticBaby: LorcanitoCharacterCard = {
//   id: "fk2",
//   missingTestCase: true,
//   name: "Noi",
//   title: "Acrobatic Baby",
//   characteristics: ["storyborn", "ally"],
//   text: "**FANCY FOOTWORK** Whenever you play an action, this character takes no damage from challenges this turn.",
//   type: "character",
//   abilities: [
//     wheneverPlays({
//       name: "Fancy Footwork",
//       text: "Whenever you play an action, this character takes no damage from challenges this turn.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["action"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       effects: [
//         // Implementation would need special protection effect here
//       ],
//     }),
//   ],
//   flavour: "Fortune favors the bold - no matter how small.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 4,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Denny Minonne",
//   number: 119,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550596,
//   },
//   rarity: "super_rare",
// };
//
