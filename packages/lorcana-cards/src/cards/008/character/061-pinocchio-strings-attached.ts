// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { wheneverYouReadyThisCharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const pinocchioStringsAttached: LorcanitoCharacterCard = {
//   id: "gvb",
//   name: "Pinocchio",
//   title: "Strings Attached",
//   characteristics: ["storyborn", "hero"],
//   text: "Evasive (Only characters with Evasive can challenge this character.)\nGOT TO KEEP REAL QUIET Once during your turn, whenever you ready this character, you may draw a card.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     wheneverYouReadyThisCharacter({
//       name: "GOT TO KEEP REAL QUIET",
//       text: "Once during your turn, whenever you ready this character, you may draw a card.",
//       optional: true,
//       oncePerTurn: true,
//       conditions: [duringYourTurn],
//       effects: [drawACard],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 0,
//   willpower: 4,
//   illustrator: "Hedvig H.S",
//   number: 61,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631340,
//   },
//   rarity: "legendary",
//   lore: 2,
// };
//
