// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { eachOtherCharacterInPlay } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { putDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const aliceClumsyAsCanBe: LorcanitoCharacterCard = {
//   id: "j5g",
//   name: "Alice",
//   title: "Clumsy as Can Be",
//   characteristics: ["floodborn", "hero"],
//   text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Alice.)\nACCIDENT PRONE Whenever this character quests, put 1 damage counter on each other character.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Alice"),
//     wheneverThisCharacterQuests({
//       name: "ACCIDENT PRONE",
//       text: "Whenever this character quests, put 1 damage counter on each other character.",
//       effects: [putDamageEffect(1, eachOtherCharacterInPlay)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald", "ruby"],
//   cost: 6,
//   strength: 2,
//   willpower: 6,
//   illustrator: "Arianna Rea",
//   number: 104,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631417,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
