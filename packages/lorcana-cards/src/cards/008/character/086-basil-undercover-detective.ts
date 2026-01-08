// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import {
//   opponentDiscardsARandomCard,
//   returnChosenCharacterToHand,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const basilUndercoverDetective: LorcanitoCharacterCard = {
//   id: "w7k",
//   name: "Basil",
//   title: "Undercover Detective",
//   characteristics: ["dreamborn", "hero", "detective"],
//   text: "INCAPACITATE When you play this character, you may return chosen character to their player's hand.\nINTERFERE Whenever this character quests, chosen opponent discards a card at random.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "INCAPACITATE",
//       text: "When you play this character, you may return chosen character to their player's hand",
//       optional: true,
//       effects: [returnChosenCharacterToHand()],
//     }),
//     wheneverThisCharacterQuests({
//       name: "INTERFERE",
//       text: "Whenever this character quests, chosen opponent discards a card at random.",
//       effects: [opponentDiscardsARandomCard],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 7,
//   strength: 5,
//   willpower: 4,
//   illustrator: "Stefano Spagnuolo",
//   number: 86,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631407,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
