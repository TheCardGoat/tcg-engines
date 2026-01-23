import type { CharacterCard } from "@tcg/lorcana-types";

export const trustyLoyalBloodhound: CharacterCard = {
  id: "oyt",
  cardType: "character",
  name: "Trusty",
  version: "Loyal Bloodhound",
  fullName: "Trusty - Loyal Bloodhound",
  inkType: ["amber"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 6,
  inkable: true,
  externalIds: {
    ravensburger: "59fb789b94c97942a564b6c0fd20a35b436b07c6",
  },
  abilities: [
    {
      id: "oyt-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const trustyLoyalBloodhound: LorcanitoCharacterCard = {
//   id: "kcq",
//   name: "Trusty",
//   title: "Loyal Bloodhound",
//   characteristics: ["storyborn", "ally"],
//   text: "Support",
//   type: "character",
//   abilities: [supportAbility],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Yu Nguyen",
//   number: 6,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619409,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
