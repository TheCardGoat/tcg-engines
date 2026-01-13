import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelReadyForAdventure: CharacterCard = {
  id: "1fr",
  cardType: "character",
  name: "Rapunzel",
  version: "Ready for Adventure",
  fullName: "Rapunzel - Ready for Adventure",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "010",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nACT OF KINDNESS Whenever one of your characters is chosen for Support, until the start of your next turn, the next time they would be dealt damage they take no damage instead.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 3,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ba860f11c194f1fce5cdd72524d3f7e5091ab053",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AbilityEffect,
//   LorcanitoCharacterCard,
//   ProtectionEffect,
// } from "@lorcanito/lorcana-engine";
// import {
//   type StaticAbilityWithEffect,
//   supportAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// const id = "vvy";
//
// const damageProtectionEffect: ProtectionEffect = {
//   type: "protection",
//   from: "damage",
//   until: true,
//   times: 1,
//   duration: "next_turn",
//   target: chosenCharacter,
// };
//
// const actOfKindnessAbility: StaticAbilityWithEffect = {
//   type: "static",
//   ability: "effects",
//   name: "ACT OF KINDNESS",
//   text: "Whenever one of your characters is chosen for Support, it gains: Until the start of your next turn, the next time it would take damage, prevent that damage instead.",
//   effects: [damageProtectionEffect],
// };
//
// export const actOfKindnessEffect: AbilityEffect = {
//   type: "ability",
//   ability: "custom",
//   customAbility: actOfKindnessAbility,
//   modifier: "add",
//   duration: "next_turn",
//   until: true,
//   times: 1,
//   target: chosenCharacter,
//   conditions: [
//     {
//       type: "filter",
//       filters: [
//         { filter: "publicId", value: id },
//         { filter: "owner", value: "self" },
//       ],
//       comparison: {
//         operator: "gte",
//         value: 1,
//       },
//     },
//   ],
// };
//
// export const rapunzelReadyForAdventure: LorcanitoCharacterCard = {
//   id: id,
//   name: "Rapunzel",
//   title: "Ready for Adventure",
//   characteristics: ["dreamborn", "hero", "princess"],
//   text: "Support\n\nACT OF KINDNESS Whenever one of your characters is chosen for Support, it gains: Until the start of your next turn, the next time it would take damage, prevent that damage instead.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Jackie Droujko",
//   number: 3,
//   set: "010",
//   rarity: "legendary",
//   lore: 1,
//   abilities: [supportAbility],
// };
//
