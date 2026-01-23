import type { CharacterCard } from "@tcg/lorcana-types";

export const beastWounded: CharacterCard = {
  id: "hmw",
  cardType: "character",
  name: "Beast",
  version: "Wounded",
  fullName: "Beast - Wounded",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "THAT HURTS! This character enters play with 4 damage.",
  cost: 3,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 103,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3f8fb210c1173eefb48305622dfa9ba4ebeeaa26",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const beastWounded: LorcanitoCharacterCard = {
//   id: "jrk",
//   name: "Beast",
//   title: "Wounded",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**THAT HURTS!** This character enters play with 4 damage.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "THAT HURTS!",
//       text: "This character enters play with 4 damage.",
//       effects: [
//         {
//           type: "damage",
//           amount: 4,
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "It wasn't the severity of the wounds but the sickly substance that caused such unbearable pain.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 2,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Ian MacDonald",
//   number: 103,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550588,
//   },
//   rarity: "uncommon",
// };
//
