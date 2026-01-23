import type { CharacterCard } from "@tcg/lorcana-types";

export const markowskiSpaceTrooper: CharacterCard = {
  id: "1t3",
  cardType: "character",
  name: "Markowski",
  version: "Space Trooper",
  fullName: "Markowski - Space Trooper",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 113,
  inkable: true,
  externalIds: {
    ravensburger: "ead46bfd3bf059ae7fe97fb6163a498b70b7e8a7",
  },
  abilities: [
    {
      id: "1t3-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const markowskiSpaceTrooper: LorcanitoCharacterCard = {
//   id: "okv",
//   name: "Markowski",
//   title: "Space Trooper",
//   characteristics: ["storyborn", "ally"],
//   text: "Evasive (Only characters with Evasive can challenge this character.)",
//   type: "character",
//   abilities: [evasiveAbility],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 3,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Kevin Sidharta",
//   number: 113,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592019,
//   },
//   rarity: "common",
// };
//
