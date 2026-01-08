// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const rayaHeadstrong: LorcanitoCharacterCard = {
//   id: "a5t",
//   reprints: ["g6t"],
//   name: "Raya",
//   title: "Headstrong",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**NOTE TO SELF, DON’T DIE** During your turn, whenever this character banishes another character in a challenge, you may ready this character. She can’t quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     wheneverBanishesAnotherCharacterInChallenge({
//       name: "Note to Self, Don't Die",
//       text: "During your turn, whenever this character banishes another character in a challenge, you may ready this character. She can’t quest for the rest of this turn.",
//       effects: [
//         ...readyAndCantQuest({
//           type: "card",
//           value: "all",
//           filters: [{ filter: "source", value: "self" }],
//         }),
//       ],
//     }),
//   ],
//   flavour:
//     "Two parts bravery, one part cleverness, and a whole lot of determination.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Amber Kommavongsa",
//   number: 122,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527183,
//   },
//   rarity: "common",
// };
//
