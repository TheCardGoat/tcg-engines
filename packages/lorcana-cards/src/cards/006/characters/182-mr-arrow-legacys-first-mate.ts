import type { CharacterCard } from "@tcg/lorcana-types";

export const mrArrowLegacysFirstMate: CharacterCard = {
  id: "1am",
  cardType: "character",
  name: "Mr. Arrow",
  version: "Legacy's First Mate",
  fullName: "Mr. Arrow - Legacy's First Mate",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 182,
  inkable: true,
  externalIds: {
    ravensburger: "a814e468ab73333f21ba1a0d58cb731f9dcf1521",
  },
  abilities: [
    {
      id: "1am-1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
      text: "Resist +1",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { resistAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const mrArrowLegacysFirstMate: LorcanitoCharacterCard = {
//   id: "l9e",
//   name: "Mr. Arrow",
//   title: "Legacy's First Mate",
//   characteristics: ["storyborn", "ally", "alien"],
//   text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
//   type: "character",
//   abilities: [resistAbility(1)],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Michela Cacciatore / Giulia Priori",
//   number: 182,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587970,
//   },
//   rarity: "common",
// };
//
