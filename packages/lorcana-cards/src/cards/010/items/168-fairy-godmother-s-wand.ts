// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenPrincessCharacterOfYours: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//     { filter: "owner", value: "self" },
//     { filter: "characteristics", value: ["princess"] },
//   ],
// };
//
// const fairyGodmothersWandAbility = wheneverACardIsPutIntoYourInkwell({
//   name: "Only Till Midnight",
//   text: "During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
//   optional: true,
//   conditions: [{ type: "during-turn", value: "self" }],
//   effects: [
//     {
//       type: "ability",
//       ability: "ward",
//       duration: "next_turn",
//       until: true,
//       modifier: "add",
//       target: chosenPrincessCharacterOfYours,
//     },
//   ],
// });
//
// export const fairyGodmothersWand: LorcanitoItemCard = {
//   id: "vw5",
//   name: "Fairy Godmother's Wand",
//   characteristics: ["item"],
//   text: "ONLY TILL MIDNIGHT During your turn, whenever you put a card into your inkwell, chosen Princess character of yours gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
//   type: "item",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Aurélie Lise-Anne",
//   number: 168,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658786,
//   },
//   rarity: "super_rare",
//   abilities: [fairyGodmothersWandAbility],
// };
//
