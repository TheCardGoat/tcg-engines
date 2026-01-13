// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   ExertEffect,
//   HealEffect,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
//
// const yourOtherDamageChars: CardEffectTarget = {
//   type: "card",
//   value: "all",
//   excludeSelf: true,
//   filters: [
//     { filter: "owner", value: "self" },
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "status", value: "damaged" },
//   ],
// };
//
// const readyYourOtherDamagedCharacters: ExertEffect = {
//   type: "exert",
//   exert: false,
//   target: yourOtherDamageChars,
// };
//
// const removeOneDamageFromYourOtherCharacters: HealEffect = {
//   type: "heal",
//   amount: 1,
//   upTo: true,
//   target: yourOtherDamageChars,
// };
//
// export const goofyGroundbreakingChef: LorcanitoCharacterCard = {
//   id: "a5y",
//   name: "Goofy",
//   title: "Groundbreaking Chef",
//   characteristics: ["storyborn", "hero"],
//   text: "PLENTY TO GO AROUND At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.",
//   type: "character",
//   abilities: [
//     atTheEndOfYourTurn({
//       name: "PLENTY TO GO AROUND",
//       text: "At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.",
//       optional: true,
//       effects: [
//         readyYourOtherDamagedCharacters,
//         removeOneDamageFromYourOtherCharacters,
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   illustrator: "Carlos Luzzi",
//   number: 4,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 632719,
//   },
//   rarity: "legendary",
//   lore: 2,
// };
//
