import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelCreativeCaptor: CharacterCard = {
  id: "1gl",
  cardType: "character",
  name: "Rapunzel",
  version: "Creative Captor",
  fullName: "Rapunzel - Creative Captor",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "010",
  text: "ENSNARL When you play this character, chosen opposing character gets -3 {S} this turn.",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 143,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bd851b8f1a2e26ff38337ab860a646858284a865",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const rapunzelCreativeCaptor: LorcanitoCharacterCard = {
//   id: "dtr",
//   name: "Rapunzel",
//   title: "Creative Captor",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "ENSNARL When you play this character, chosen opposing character gets -3 {S} this turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 3,
//   willpower: 6,
//   illustrator: "Mariana Moreno",
//   number: 143,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659455,
//   },
//   rarity: "common",
//   abilities: [
//     whenYouPlayThis({
//       name: "ENSNARL",
//       text: "When you play this character, chosen opposing character gets -3 this turn.",
//       optional: true,
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 3,
//           modifier: "subtract",
//           target: chosenOpposingCharacter,
//           duration: "turn",
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
