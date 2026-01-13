import type { CharacterCard } from "@tcg/lorcana-types";

export const boltDependableFriend: CharacterCard = {
  id: "j9c",
  cardType: "character",
  name: "Bolt",
  version: "Dependable Friend",
  fullName: "Bolt - Dependable Friend",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "007",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 18,
  inkable: true,
  externalIds: {
    ravensburger: "4569c6b9d1aa773811189e4fe7746e13a5b67569",
  },
  abilities: [
    {
      id: "j9c-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const boltDependableFriend: LorcanitoCharacterCard = {
//   id: "wzy",
//   name: "Bolt",
//   title: "Dependable Friend",
//   characteristics: ["storyborn", "hero"],
//   text: "Support",
//   type: "character",
//   abilities: [supportAbility],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Ellie Horie",
//   number: 18,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618157,
//   },
//   rarity: "common",
//   lore: 2,
// };
//
