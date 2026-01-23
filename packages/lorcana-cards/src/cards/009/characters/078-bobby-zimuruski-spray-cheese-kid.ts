import type { CharacterCard } from "@tcg/lorcana-types";

export const bobbyZimuruskiSprayCheeseKid: CharacterCard = {
  id: "1kg",
  cardType: "character",
  name: "Bobby Zimuruski",
  version: "Spray Cheese Kid",
  fullName: "Bobby Zimuruski - Spray Cheese Kid",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  text: "SO CHEESY When you play this character, you may draw a card, then choose and discard a card.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 78,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cb878152b6ffe069a87f49091e1ef762cd612744",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const bobbyZimuruskiSprayCheeseKid: LorcanitoCharacterCard = {
//   id: "wcd",
//   missingTestCase: true,
//   name: "Bobby Zimuruski",
//   title: "Spray Cheese Kid",
//   characteristics: ["storyborn", "ally"],
//   text: "SO CHEESY When you play this character, you may draw a card, then choose and discard a card.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Stefano Spagnuolo",
//   number: 78,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650018,
//   },
//   rarity: "uncommon",
//   abilities: [youMayDrawThenChooseAndDiscard],
//   lore: 1,
// };
//
