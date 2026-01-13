import type { CharacterCard } from "@tcg/lorcana-types";

export const princeEricDashingAndBrave: CharacterCard = {
  id: "1cu",
  cardType: "character",
  name: "Prince Eric",
  version: "Dashing and Brave",
  fullName: "Prince Eric - Dashing and Brave",
  inkType: ["steel"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Challenger +2 (While challenging, this character gets +2 {S}).",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 194,
  inkable: true,
  externalIds: {
    ravensburger: "b003941c689f0757920787101a49607295e99da1",
  },
  abilities: [
    {
      id: "1cu-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      text: "Challenger +2.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { priceEricDashingAndBrave as ogPrinceEricDashingAndBrave } from "@lorcanito/lorcana-engine/cards/001/characters/187-prince-eric-dashing-and-brave";
//
// export const princeEricDashingAndBrave: LorcanitoCharacterCard = {
//   ...ogPrinceEricDashingAndBrave,
//   id: "rfl",
//   reprints: [ogPrinceEricDashingAndBrave.id],
//   number: 194,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650127,
//   },
// };
//
