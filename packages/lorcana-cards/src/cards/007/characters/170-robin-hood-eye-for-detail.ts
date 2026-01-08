import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodEyeForDetail: CharacterCard = {
  id: "193",
  cardType: "character",
  name: "Robin Hood",
  version: "Eye for Detail",
  fullName: "Robin Hood - Eye for Detail",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "007",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 170,
  inkable: true,
  externalIds: {
    ravensburger: "a4d8629141486ff391420a5a92cc523b1bdfc285",
  },
  abilities: [
    {
      id: "193-1",
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
// export const robinHoodEyeForDetail: LorcanitoCharacterCard = {
//   id: "fz9",
//   name: "Robin Hood",
//   title: "Eye for Detail",
//   characteristics: ["storyborn", "hero"],
//   text: "Support",
//   type: "character",
//   abilities: [supportAbility],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Mariana Moreno",
//   number: 170,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618712,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
