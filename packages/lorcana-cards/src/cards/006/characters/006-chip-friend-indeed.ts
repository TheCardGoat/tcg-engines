import type { CharacterCard } from "@tcg/lorcana-types";

export const chipFriendIndeed: CharacterCard = {
  id: "1x3",
  cardType: "character",
  name: "Chip",
  version: "Friend Indeed",
  fullName: "Chip - Friend Indeed",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "DALE'S PARTNER When you play this character, chosen character gets +1 {L} this turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 6,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f903848c6aae6484763bdfea2e71c79d672e8bda",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const chipFriendIndeed: LorcanitoCharacterCard = {
//   id: "dr5",
//   name: "Chip",
//   title: "Friend Indeed",
//   characteristics: ["hero", "storyborn"],
//   text: "**DALE'S PARTNER** When you play this character, chosen character gets +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "DALE'S PARTNER",
//       text: "When you play this character, chosen character gets +1 {L} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "Come on, Dale—this is no time for hanging around!",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Ron Baird",
//   number: 6,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578167,
//   },
//   rarity: "common",
// };
//
