// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { youDidntPutAnyCardsIntoYourInkwellThisTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { banishThisCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ratiganGreedyGenius: LorcanitoCharacterCard = {
//   id: "m7c",
//   name: "Ratigan",
//   title: "Greedy Genius",
//   characteristics: ["storyborn", "villain"],
//   text: "Ward\nTIME RUNS OUT At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
//   type: "character",
//   abilities: [
//     wardAbility,
//     atTheEndOfYourTurn({
//       name: "TIME RUNS OUT",
//       text: "At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
//       conditions: [youDidntPutAnyCardsIntoYourInkwellThisTurn],
//       effects: [banishThisCharacter],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 8,
//   strength: 6,
//   willpower: 7,
//   illustrator: "Matthew Robert Davies",
//   number: 167,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631464,
//   },
//   rarity: "legendary",
//   lore: 4,
// };
//
