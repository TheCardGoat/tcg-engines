import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuInHerElement: CharacterCard = {
  id: "39b",
  cardType: "character",
  name: "Sisu",
  version: "In Her Element",
  fullName: "Sisu - In Her Element",
  inkType: ["amethyst"],
  franchise: "Raya and the Last Dragon",
  set: "006",
  text: "Challenger +2 (While challenging, this character gets +2 {S}).",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 39,
  inkable: true,
  externalIds: {
    ravensburger: "0bbeceed403764a29bc21ac53a1d7095e9c56321",
  },
  abilities: [
    {
      id: "39b-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
      text: "Challenger +2.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const sisuInHerElement: LorcanitoCharacterCard = {
//   id: "cw6",
//   name: "Sisu",
//   title: "In Her Element",
//   characteristics: ["hero", "storyborn", "dragon", "deity"],
//   text: "**Challenger +2** _(While challenging, this character gets +2 {S}.)_",
//   type: "character",
//   abilities: [challengerAbility(2)],
//   flavour: "I'm a water dragon. This is water. It's sort of my thing.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 3,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Grace Tran",
//   number: 39,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578173,
//   },
//   rarity: "common",
// };
//
