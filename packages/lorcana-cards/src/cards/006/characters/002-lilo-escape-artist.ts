import type { CharacterCard } from "@tcg/lorcana-types";

export const liloEscapeArtist: CharacterCard = {
  id: "105",
  cardType: "character",
  name: "Lilo",
  version: "Escape Artist",
  fullName: "Lilo - Escape Artist",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "NO PLACE I’D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 2,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "84622499364f41f7265a750bae22792b349b212d",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { thisCard } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const liloEscapeArtist: LorcanitoCharacterCard = {
//   id: "eti",
//   name: "Lilo",
//   title: "Escape Artist",
//   characteristics: ["storyborn", "hero"],
//   text: "NO PLACE I’D RATHER BE At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
//   type: "character",
//   abilities: [
//     atTheStartOfYourTurn({
//       name: "No Place I’d Rather Be",
//       text: "At the start of your turn, if this card is in your discard, you may play her and she enters play exerted.",
//       optional: true,
//       doesItTriggerFromDiscard: true,
//       conditions: [
//         {
//           type: "filter",
//           filters: [...thisCard.filters, { filter: "zone", value: "discard" }],
//           comparison: { operator: "eq", value: 1 },
//         },
//       ],
//       effects: [
//         {
//           type: "play",
//           forFree: false,
//           exerted: true,
//           target: thisCard,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Grzegorz Krysiński",
//   number: 2,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592015,
//   },
//   rarity: "super_rare",
// };
//
