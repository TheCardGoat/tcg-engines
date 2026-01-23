import type { CharacterCard } from "@tcg/lorcana-types";

export const jaqConnoisseurOfClimbing: CharacterCard = {
  id: "1u5",
  cardType: "character",
  name: "Jaq",
  version: "Connoisseur of Climbing",
  fullName: "Jaq - Connoisseur of Climbing",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "004",
  text: "SNEAKY IDEA When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 77,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f0675a175f212c4b0fba027fb9728620ab990e7c",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const jaqConnoisseurOfClimbing: LorcanitoCharacterCard = {
//   id: "d8y",
//   name: "Jaq",
//   title: "Connoisseur of Climbing",
//   characteristics: ["storyborn", "ally"],
//   text: "**SNEAKY IDEA** When you play this character, chosen opposing character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "ability",
//           ability: "reckless",
//           modifier: "add",
//           duration: "next_turn",
//           target: chosenOpposingCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "Teamwork makes the cheese work.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 1,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Maddie Shilt",
//   number: 77,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547781,
//   },
//   rarity: "common",
// };
//
