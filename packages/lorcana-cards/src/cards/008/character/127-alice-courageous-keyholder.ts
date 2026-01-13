// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenYourDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const aliceCourageousKeyholder: LorcanitoCharacterCard = {
//   id: "q7w",
//   name: "Alice",
//   title: "Courageous Keyholder",
//   characteristics: ["storyborn", "hero"],
//   text: "THIS WAY OUT When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "THIS WAY OUT",
//       text: "When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.",
//       optional: true,
//       effects: readyAndCantQuest(chosenYourDamagedCharacter),
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Filipe Laurentino",
//   number: 127,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631433,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
