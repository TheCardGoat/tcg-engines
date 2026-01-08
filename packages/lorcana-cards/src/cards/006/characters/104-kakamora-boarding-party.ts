import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraBoardingParty: CharacterCard = {
  id: "7k1",
  cardType: "character",
  name: "Kakamora",
  version: "Boarding Party",
  fullName: "Kakamora - Boarding Party",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  text: "Rush (This character can challenge the turn they're played.)",
  cost: 4,
  strength: 5,
  willpower: 2,
  lore: 1,
  cardNumber: 104,
  inkable: false,
  externalIds: {
    ravensburger: "1b4a8518d45c24ba97ec36484731e8b55c085d5b",
  },
  abilities: [
    {
      id: "7k1-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const kakamoraBoardingParty: LorcanitoCharacterCard = {
//   id: "mbl",
//   name: "Kakamora",
//   title: "Boarding Party",
//   characteristics: ["storyborn", "pirate"],
//   text: "**Rush** _(This character can challenge the turn they're played.)_",
//   type: "character",
//   abilities: [rushAbility],
//   flavour: "Moana: Do you think they saw us? \nMaui: They saw us.",
//   colors: ["ruby"],
//   cost: 4,
//   strength: 5,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Saulo Nate",
//   number: 104,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578187,
//   },
//   rarity: "uncommon",
// };
//
