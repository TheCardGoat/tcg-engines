import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipRoyalExplorer: CharacterCard = {
  id: "11j",
  cardType: "character",
  name: "Prince Phillip",
  version: "Royal Explorer",
  fullName: "Prince Phillip - Royal Explorer",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 83,
  inkable: true,
  externalIds: {
    ravensburger: "875592f80cfc4d6e34c02219ce9530abc27695f8",
  },
  abilities: [
    {
      id: "11j-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const princePhillipRoyalExplorer: LorcanitoCharacterCard = {
//   id: "p99",
//   name: "Prince Phillip",
//   title: "Royal Explorer",
//   characteristics: ["storyborn", "hero", "prince"],
//   text: "Ward (Opponents can't choose this character except to challenge.)",
//   type: "character",
//   abilities: [wardAbility],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Gaku Kumatori",
//   number: 83,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593039,
//   },
//   rarity: "uncommon",
// };
//
