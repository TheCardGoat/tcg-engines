import type { CharacterCard } from "@tcg/lorcana-types";

export const gadgetHackwrenchCreativeThinker: CharacterCard = {
  id: "1w4",
  cardType: "character",
  name: "Gadget Hackwrench",
  version: "Creative Thinker",
  fullName: "Gadget Hackwrench - Creative Thinker",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "BRAINSTORM Whenever you play an item, this character gets +1 {L} this turn.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 139,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f6da830b7096c6853bab316ec8aa8a3436023b1a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverYouPlayAnItem } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { thisCharacterGetsLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const gadgetHackwrenchCreativeThinker: LorcanitoCharacterCard = {
//   id: "vqq",
//   missingTestCase: true,
//   name: "Gadget Hackwrench",
//   title: "Creative Thinker",
//   characteristics: ["storyborn", "ally", "inventor"],
//   text: "BRAINSTORM Whenever you play an item, this character gets +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     wheneverYouPlayAnItem({
//       name: "Brainstorm",
//       text: "Whenever you play an item, this character gets +1 {L} this turn.",
//       effects: [thisCharacterGetsLore(1)],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 1,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Andrea Fernandez",
//   number: 139,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588152,
//   },
//   rarity: "common",
// };
//
