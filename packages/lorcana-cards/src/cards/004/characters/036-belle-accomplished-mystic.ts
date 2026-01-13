// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   moveDamageAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   chosenCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const belleAccomplishedMystic: LorcanitoCharacterCard = {
//   id: "j8p",
//   reprints: ["cqp"],
//   missingTestCase: true,
//   name: "Belle",
//   title: "Accomplished Mystic",
//   characteristics: ["hero", "floodborn", "sorcerer", "princess"],
//   text: "**Shift** 3\n\n\n**ENHANCED HEALING** When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "belle"),
//     whenYouPlayThis({
//       name: "ENHANCED HEALING",
//       text: "When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.",
//       optional: true,
//       ...moveDamageAbility({
//         amount: 3,
//         upTo: true,
//         from: chosenCharacter,
//         to: chosenOpposingCharacter,
//       }),
//     }),
//   ],
//   flavour: "The mixed ink had changed more than just the rose.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Malia Ewart",
//   number: 36,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549294,
//   },
//   rarity: "super_rare",
// };
//
