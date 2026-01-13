// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { getStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const gyroGearlooseEccentricInventor: LorcanitoCharacterCard = {
//   id: "r2u",
//   name: "Gyro Gearloose",
//   title: "Eccentric Inventor",
//   characteristics: ["storyborn", "ally", "inventor"],
//   text: "Evasive (Only characters with Evasive can challenge this character.)\nI'LL SHOW YOU! When you play this character, chosen opposing character gets -3 {S} this turn.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     whenYouPlayThisCharacter({
//       name: "I'LL SHOW YOU!",
//       text: "When you play this character, chosen opposing character gets -3 {S} this turn.",
//       effects: [getStrengthThisTurn(-3, chosenOpposingCharacter)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby", "sapphire"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   illustrator: "Pietro B. Zemelo",
//   number: 123,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631429,
//   },
//   rarity: "rare",
//   lore: 1,
// };
//
