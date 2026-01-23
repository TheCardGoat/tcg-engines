import type { CharacterCard } from "@tcg/lorcana-types";

export const billyBonesSpaceSailor: CharacterCard = {
  id: "1oc",
  cardType: "character",
  name: "Billy Bones",
  version: "Space Sailor",
  fullName: "Billy Bones - Space Sailor",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "KEEP IT HIDDEN When this character is banished, you may banish chosen item or location.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 185,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d9747118f33198abebde6af5d847e6ea933d788e",
  },
  abilities: [],
  classifications: ["Storyborn", "Alien", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { banishChosenItemOrLocation } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const billyBonesSpaceSailor: LorcanitoCharacterCard = {
//   id: "vn5",
//   missingTestCase: true,
//   name: "Billy Bones",
//   title: "Space Sailor",
//   characteristics: ["storyborn", "alien", "pirate"],
//   text: "KEEP IT HIDDEN When this character is banished, you may banish chosen item or location.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanished({
//       name: "Keep It Hidden",
//       text: "When this character is banished, you may banish chosen item or location.",
//       optional: true,
//       effects: [banishChosenItemOrLocation],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Diego Saito",
//   number: 185,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587375,
//   },
//   rarity: "uncommon",
// };
//
