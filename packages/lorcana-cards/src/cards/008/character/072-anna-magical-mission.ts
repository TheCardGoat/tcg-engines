// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   shiftAbility,
//   supportAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const annaMagicalMission: LorcanitoCharacterCard = {
//   id: "uvp",
//   name: "Anna",
//   title: "Magical Mission",
//   characteristics: ["floodborn", "hero", "queen", "sorcerer"],
//   text: "Shift 4 \nSupport \nCOORDINATED PLAN Whenever this character quests, if you have a character named Elsa in play, you may draw a card.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Anna"),
//     supportAbility,
//     wheneverThisCharacterQuests({
//       name: "COORDINATED PLAN",
//       text: "Whenever this character quests, if you have a character named Elsa in play, you may draw a card.",
//       optional: true,
//       conditions: [ifYouHaveCharacterNamed(["Elsa"])],
//       effects: [drawACard],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst", "sapphire"],
//   cost: 6,
//   strength: 3,
//   willpower: 6,
//   illustrator: "Luigi Aimè",
//   number: 72,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631399,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
