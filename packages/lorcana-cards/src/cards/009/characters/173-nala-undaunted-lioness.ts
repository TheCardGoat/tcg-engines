import type { CharacterCard } from "@tcg/lorcana-types";

export const nalaUndauntedLioness: CharacterCard = {
  id: "1xs",
  cardType: "character",
  name: "Nala",
  version: "Undaunted Lioness",
  fullName: "Nala - Undaunted Lioness",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "009",
  text: "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 2,
  cardNumber: 173,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fb7ea808456214e200b4637c8b19a6e87955731f",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   whileThisCharacterHasNoDamageGains,
//   whileThisCharacterHasNoDamageGets,
// } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const nalaUndauntedLioness: LorcanitoCharacterCard = {
//   id: "dg0",
//   name: "Nala",
//   title: "Undaunted Lioness",
//   characteristics: ["storyborn", "ally"],
//   text: "DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)",
//   type: "character",
//   inkwell: false,
//   colors: ["steel"],
//   cost: 2,
//   strength: 0,
//   willpower: 2,
//   illustrator: "Eri Welli",
//   number: 173,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650107,
//   },
//   rarity: "rare",
//   abilities: [
//     whileThisCharacterHasNoDamageGains({
//       name: "Determined Diversion",
//       text: "While this character has no damage, she gets +1 {L} and gains Resist +1.",
//       ability: resistAbility(1),
//     }),
//     whileThisCharacterHasNoDamageGets({
//       name: "Determined Diversion",
//       text: "While this character has no damage, she gets +1 {L} and gains Resist +1.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "static",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
