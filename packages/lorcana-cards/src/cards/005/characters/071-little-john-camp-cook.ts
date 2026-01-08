import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnCampCook: CharacterCard = {
  id: "1vm",
  cardType: "character",
  name: "Little John",
  version: "Camp Cook",
  fullName: "Little John - Camp Cook",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  cost: 1,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 71,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "f3bd7f21b2042b4780b071894f26a382dc5be6f1",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const littleJohnCampCook: LorcanitoCharacterCard = {
//   id: "olq",
//   name: "Little John",
//   title: "Camp Cook",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour:
//     "You're in for a real treat, Rob. Tonight's house special is my famous outlaw grub. Made from the finest whatever we could find!",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   willpower: 4,
//   strength: 0,
//   lore: 1,
//   illustrator: "John Loren",
//   number: 71,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561191,
//   },
//   rarity: "uncommon",
// };
//
