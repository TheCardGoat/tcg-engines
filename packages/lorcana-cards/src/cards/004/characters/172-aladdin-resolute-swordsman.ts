import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinResoluteSwordsman: CharacterCard = {
  id: "gc6",
  cardType: "character",
  name: "Aladdin",
  version: "Resolute Swordsman",
  fullName: "Aladdin - Resolute Swordsman",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "004",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 172,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "3ae24edc572e0092a6b460c4cad956c1859b0525",
  },
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const aladdinResoluteSwordsman: LorcanitoCharacterCard = {
//   id: "i0q",
//   name: "Aladdin",
//   title: "Resolute Swordsman",
//   characteristics: ["hero", "storyborn"],
//   type: "character",
//   flavour:
//     "How about we get straight to the part where I leave quickly and you scream after me? No? I can't say I didn't give you a chance.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Randy Bishop",
//   number: 172,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550617,
//   },
//   rarity: "common",
// };
//
