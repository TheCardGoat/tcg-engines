// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const trampObservantGuardian: LorcanitoCharacterCard = {
//   id: "gh5",
//   name: "Tramp",
//   title: "Observant Guardian",
//   characteristics: ["storyborn", "hero"],
//   text: "HOW DO I GET IN? When you play this character, chosen character gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "HOW DO I GET IN?",
//       text: "When you play this character, chosen character gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
//       effects: [
//         {
//           type: "ability",
//           ability: "ward",
//           duration: "next_turn",
//           until: true,
//           modifier: "add",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Edu Francisco",
//   number: 87,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631408,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
