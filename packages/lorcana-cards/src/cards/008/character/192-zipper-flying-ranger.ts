// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   duringYourTurnThisCharacterGains,
//   evasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const zipperFlyingRanger: LorcanitoCharacterCard = {
//   id: "ql7",
//   name: "Zipper",
//   title: "Flying Ranger",
//   characteristics: ["storyborn", "ally"],
//   text: "BEST MATES If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
//   type: "character",
//   abilities: [
//     whenYouPlayThisForEachYouPayLess({
//       name: "BEST MATES",
//       text: "If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.",
//       amount: 1,
//       conditions: [ifYouHaveCharacterNamed("Monterey Jack")],
//     }),
//     duringYourTurnThisCharacterGains({
//       name: "BURST OF SPEED",
//       text: "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
//       ability: evasiveAbility,
//       conditions: [],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Ian MacDonald",
//   number: 192,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631476,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
