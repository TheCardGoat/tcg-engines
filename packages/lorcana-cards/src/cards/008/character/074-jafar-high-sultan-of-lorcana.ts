// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import { parentsTarget } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import {
//   discardACard,
//   drawACard,
// } from "@lorcanito/lorcana-engine/effects/effects";
// import type { CreateLayerBasedOnTarget } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const illusionCharacter: CardEffectTarget = {
//   type: "card",
//   value: "all",
//   filters: [
//     { filter: "type", value: "character" },
//     { filter: "characteristics", value: ["illusion"] },
//     { filter: "owner", value: "self" },
//   ],
// };
//
// const ifItsAnIllusionCardPlayForFree: CreateLayerBasedOnTarget = {
//   type: "create-layer-based-on-target",
//   // TODO: get rid of target
//   target: {} as CardEffectTarget, // unused by the code logic
//   filters: illusionCharacter.filters,
//   numberOfMatchingTargets: { operator: "eq", value: 1 },
//   effects: [
//     {
//       type: "play",
//       forFree: true,
//       target: parentsTarget,
//     },
//   ],
// };
//
// export const jafarHighSultanOfLorcana: LorcanitoCharacterCard = {
//   id: "lqa",
//   name: "Jafar",
//   title: "High Sultan of Lorcana",
//   characteristics: ["dreamborn", "villain", "king", "sorcerer"],
//   text: "DARK POWER Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.",
//   type: "character",
//   abilities: [
//     wheneverThisCharacterQuests({
//       name: "DARK POWER",
//       text: "Whenever this character quests, you may draw a card, then choose and discard a card. If an Illusion character card is discarded this way, you may play that character for free.",
//       optional: true,
//       resolveEffectsIndividually: true,
//       effects: [
//         drawACard,
//         {
//           ...discardACard,
//           afterEffect: [ifItsAnIllusionCardPlayForFree],
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst", "steel"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Cristian Romero",
//   number: 74,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631400,
//   },
//   rarity: "super_rare",
//   lore: 3,
// };
//
