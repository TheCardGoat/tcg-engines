import type { CharacterCard } from "@tcg/lorcana-types";

export const belleBookworm: CharacterCard = {
  id: "1rv",
  cardType: "character",
  name: "Belle",
  version: "Bookworm",
  fullName: "Belle - Bookworm",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "USE YOUR IMAGINATION While an opponent has no cards in their hand, this character gets +2 {L}.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 71,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e62d9c43e5fbd5aceee5fad79ab1e069b8c412dc",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const belleBookworm: LorcanitoCharacterCard = {
//   id: "num",
//   name: "Belle",
//   title: "Bookworm",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**USE YOUR IMAGINATION** While an opponent has no cards in their hand, this character gets +2 {L}.",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "Use Your Imagination",
//       text: "While an opponent has no cards in their hand, this character gets +2 {L}.",
//       conditions: [{ type: "hand", amount: 0, player: "opponent" }],
//       attribute: "lore",
//       amount: 2,
//     }),
//   ],
//   flavour: "There's nothing more tempting than a pile of unread books.",
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Jenna Gray",
//   number: 71,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525246,
//   },
//   rarity: "uncommon",
// };
//
