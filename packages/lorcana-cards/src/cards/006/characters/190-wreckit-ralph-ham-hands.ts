// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenItemOrLocation } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import {
//   mayBanish,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const wreckitRalphHamHands: LorcanitoCharacterCard = {
//   id: "td0",
//   missingTestCase: true,
//   name: "Wreck-it Ralph",
//   title: "Ham Hands",
//   characteristics: ["dreamborn", "hero"],
//   text: "I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "I Wreck Things",
//       text: "Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
//       optional: true,
//       effects: [mayBanish(chosenItemOrLocation), youGainLore(2)],
//     }),
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 6,
//   strength: 4,
//   willpower: 4,
//   lore: 3,
//   illustrator: "Justin Runfola",
//   number: 190,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 590821,
//   },
//   rarity: "legendary",
// };
//
