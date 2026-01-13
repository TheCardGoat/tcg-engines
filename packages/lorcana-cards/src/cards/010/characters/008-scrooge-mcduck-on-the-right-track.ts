import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckOnTheRightTrack: CharacterCard = {
  id: "ut8",
  cardType: "character",
  name: "Scrooge McDuck",
  version: "On the Right Track",
  fullName: "Scrooge McDuck - On the Right Track",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "FABULOUS WEALTH When you play this character, chosen character with a card under them gets +1 {L} this turn.",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 8,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6f0c3f6e42c972693a108ef21ea2237f1a7b876a",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// const target: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "is_under_a_card" },
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "owner", value: "self" },
//   ],
// };
// export const scroogeMcduckOnTheRightTrack: LorcanitoCharacterCard = {
//   id: "tqa",
//   name: "Scrooge McDuck",
//   title: "On the Right Track",
//   characteristics: ["storyborn", "hero"],
//   text: "FABULOUS WEALTH When you play this character, chosen character with a card under them gets +1 {L} this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Adam Fenton",
//   number: 8,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660032,
//   },
//   rarity: "uncommon",
//   lore: 1,
//   abilities: [
//     whenYouPlayThis({
//       name: "FABULOUS WEALTH",
//       text: "When you play this character, chosen character with a card under them gets +1 {L} this turn.",
//       optional: true,
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           target: target,
//           duration: "turn",
//           until: true,
//         },
//       ],
//     }),
//   ],
// };
//
