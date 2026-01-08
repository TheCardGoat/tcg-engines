// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const tobyTurtleWaryFriend: LorcanitoCharacterCard = {
//   id: "cys",
//   name: "Toby Turtle",
//   title: "Wary Friend",
//   characteristics: ["storyborn", "ally"],
//   text: "HARD SHELL While this character is exerted, he gains Resist +1. (Damage dealt to them is reduced by 1.)",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGains({
//       name: "HARD SHELL",
//       text: "While this character is exerted, he gains Resist +1. (Damage dealt to them is reduced by 1.)",
//       ability: resistAbility(1),
//       conditions: [
//         {
//           type: "exerted",
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 0,
//   willpower: 4,
//   illustrator: "Irish Chua",
//   number: 190,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631772,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
