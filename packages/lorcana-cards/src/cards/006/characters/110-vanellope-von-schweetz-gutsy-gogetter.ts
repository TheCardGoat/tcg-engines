// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { ifThisCharacterIsAtALocation } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import {
//   drawACard,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const vanellopeVonSchweetzGutsyGogetter: LorcanitoCharacterCard = {
//   id: "q7t",
//   missingTestCase: true,
//   name: "Vanellope Von Schweetz",
//   title: "Gutsy Go-Getter",
//   characteristics: ["storyborn", "hero", "princess", "racer"],
//   text: "AS READY AS I'LL EVER BE At the start of your turn, if this character is at a location, draw a card and gain 1 lore.",
//   type: "character",
//   abilities: [
//     atTheStartOfYourTurn({
//       name: "As Ready As I'll Ever Be",
//       text: "At the start of your turn, if this character is at a location, draw a card and gain 1 lore.",
//       conditions: [ifThisCharacterIsAtALocation],
//       effects: [drawACard, youGainLore(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Aurora Rue",
//   number: 110,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591981,
//   },
//   rarity: "uncommon",
// };
//
