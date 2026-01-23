import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarAspiringRuler: CharacterCard = {
  id: "1bu",
  cardType: "character",
  name: "Jafar",
  version: "Aspiring Ruler",
  fullName: "Jafar - Aspiring Ruler",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "007",
  text: "THAT'S BETTER When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 190,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ac6a2901f00291b5613e65f0a4c17baf9607964c",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const jafarAspiringRuler: LorcanitoCharacterCard = {
//   id: "t9f",
//   name: "Jafar",
//   title: "Aspiring Ruler",
//   characteristics: ["dreamborn", "villain", "sorcerer"],
//   text: "THAT'S BETTER When you play this character, chosen character gains Challenger +2 this turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThis({
//       name: "THAT'S BETTER",
//       text: "When you play this character, chosen character gains Challenger +2 this turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   illustrator: "César Vergara",
//   number: 190,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618177,
//   },
//   rarity: "common",
//   lore: 2,
// };
//
