// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const jafarPowerhungryVizier: LorcanitoCharacterCard = {
//   id: "psh",
//   missingTestCase: true,
//   name: "Jafar",
//   title: "Power‐Hungry Vizier",
//   characteristics: ["dreamborn", "villain", "sorcerer"],
//   text: "YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
//   type: "character",
//   abilities: [
//     wheneverACardIsPutIntoYourInkwell({
//       name: "You Will Be Paid When The Time Comes",
//       text: "During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
//       conditions: [{ type: "during-turn", value: "self" }],
//       effects: [dealDamageEffect(1, chosenCharacter)],
//     }),
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Federico Maria Cugliari",
//   number: 193,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591118,
//   },
//   rarity: "super_rare",
// };
//
