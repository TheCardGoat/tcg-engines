import type { CharacterCard } from "@tcg/lorcana-types";

export const basilHypnotizedMouse: CharacterCard = {
  id: "1v5",
  cardType: "character",
  name: "Basil",
  version: "Hypnotized Mouse",
  fullName: "Basil - Hypnotized Mouse",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 79,
  inkable: true,
  externalIds: {
    ravensburger: "f404642244e838db87343396d53a98cc355ec34e",
  },
  abilities: [
    {
      id: "1v5-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const basilHypnotizedMouse: LorcanitoCharacterCard = {
//   id: "i84",
//   name: "Basil",
//   title: "Hypnotized Mouse",
//   characteristics: ["dreamborn", "hero", "detective"],
//   text: "Evasive (Only characters with Evasive can challenge this character.)",
//   type: "character",
//   abilities: [evasiveAbility],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 79,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587197,
//   },
//   rarity: "common",
// };
//
