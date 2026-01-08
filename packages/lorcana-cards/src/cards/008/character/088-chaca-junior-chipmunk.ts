// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { chosenOpposingCharacterGainsRecklessDuringNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const chacaJuniorChipmunk: LorcanitoCharacterCard = {
//   id: "wro",
//   name: "Chaca",
//   title: "Junior Chipmunk",
//   characteristics: ["storyborn", "ally"],
//   text: "IN CAHOOTS When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "IN CAHOOTS",
//       text: "When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
//       conditions: [ifYouHaveCharacterNamed("Tipo")],
//       effects: [chosenOpposingCharacterGainsRecklessDuringNextTurn],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Florencia Vanzquez",
//   number: 88,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631409,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
