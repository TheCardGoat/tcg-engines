import type { CharacterCard } from "@tcg/lorcana-types";

export const marchHareAbsurdHost: CharacterCard = {
  id: "110",
  cardType: "character",
  name: "March Hare",
  version: "Absurd Host",
  fullName: "March Hare - Absurd Host",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 50,
  inkable: true,
  externalIds: {
    ravensburger: "85684498bb53ffacf3dd58bf50013dc97d5766b6",
  },
  abilities: [
    {
      id: "110-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const marchHareAbsurdHost: LorcanitoCharacterCard = {
//   id: "o8f",
//   name: "March Hare",
//   title: "Absurd Host",
//   characteristics: ["storyborn"],
//   text: "Rush (This character can challenge the turn they're played.)",
//   type: "character",
//   abilities: [rushAbility],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   lore: 2,
//   illustrator: "James Rey Sanchez",
//   number: 50,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588100,
//   },
//   rarity: "uncommon",
// };
//
