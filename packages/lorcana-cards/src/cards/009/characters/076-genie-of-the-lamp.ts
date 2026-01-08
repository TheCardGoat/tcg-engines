import type { CharacterCard } from "@tcg/lorcana-types";

export const genieOfTheLamp: CharacterCard = {
  id: "msr",
  cardType: "character",
  name: "Genie",
  version: "Of the Lamp",
  fullName: "Genie - Of the Lamp",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 76,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "522b18f2666ce430ffce71fa1ab234a5c3263b59",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileThisCharacterIsExerted } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/target";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionOnThisCharacterTargetsGain } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const genieOfTheLamp: LorcanitoCharacterCard = {
//   id: "lzg",
//   name: "Genie",
//   title: "Of the Lamp",
//   characteristics: ["dreamborn", "ally"],
//   text: "Evasive\nLET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Jeanne Plounevez",
//   number: 76,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650017,
//   },
//   rarity: "super_rare",
//   abilities: [
//     evasiveAbility,
//     whileConditionOnThisCharacterTargetsGain({
//       name: "LET'S MAKE SOME MAGIC",
//       text: "While this character is exerted, your other characters get +2 {S}",
//       conditions: [whileThisCharacterIsExerted],
//       target: thisCharacter,
//       ability: {
//         type: "static",
//         ability: "effects",
//         effects: [
//           {
//             type: "attribute",
//             attribute: "strength",
//             amount: 2,
//             modifier: "add",
//             duration: "static",
//             // until: true,
//             target: yourOtherCharacters,
//           },
//         ],
//       },
//     }),
//   ],
//   lore: 2,
// };
//
