import type { CharacterCard } from "@tcg/lorcana-types";

export const happyGoodnatured: CharacterCard = {
  id: "det",
  cardType: "character",
  name: "Happy",
  version: "Good-Natured",
  fullName: "Happy - Good-Natured",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 11,
  inkable: true,
  externalIds: {
    ravensburger: "0157bb5c2ecca10239adf522033e57b4905afa65",
  },
  abilities: [
    {
      id: "det-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const happyGoodNatured: LorcanitoCharacterCard = {
//   id: "gx6",
//   name: "Happy",
//   title: "Good-Natured",
//   characteristics: ["storyborn", "ally", "seven dwarfs"],
//   text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
//   type: "character",
//   abilities: [supportAbility],
//   flavour: "You couldn't pick a better friend.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Kendall Hale",
//   number: 11,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526383,
//   },
//   rarity: "common",
// };
//
