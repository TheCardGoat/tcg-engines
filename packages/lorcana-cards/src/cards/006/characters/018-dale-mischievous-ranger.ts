import type { CharacterCard } from "@tcg/lorcana-types";

export const daleMischievousRanger: CharacterCard = {
  id: "1i8",
  cardType: "character",
  name: "Dale",
  version: "Mischievous Ranger",
  fullName: "Dale - Mischievous Ranger",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "NUTS ABOUT PRANKS When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 18,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "056e0b84434caa8b7fbcf65fb24fb0dd2a8f4473",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { millOwnXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const daleMischievousRanger: LorcanitoCharacterCard = {
//   id: "a6c",
//   name: "Dale",
//   title: "Mischievous Ranger",
//   characteristics: ["hero", "storyborn"],
//   text: "**NUTS ABOUT PRANKS** When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       optional: true,
//       name: "Nuts About Pranks",
//       dependentEffects: true,
//       resolveEffectsIndividually: true,
//       text: "When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 3,
//           modifier: "subtract",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//         ...millOwnXCards(3),
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Rosa la Barbera / Livio Cacciatore",
//   number: 18,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578170,
//   },
//   rarity: "uncommon",
// };
//
