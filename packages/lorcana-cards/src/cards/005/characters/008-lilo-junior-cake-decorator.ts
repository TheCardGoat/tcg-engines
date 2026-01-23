import type { CharacterCard } from "@tcg/lorcana-types";

export const liloJuniorCakeDecorator: CharacterCard = {
  id: "183",
  cardType: "character",
  name: "Lilo",
  version: "Junior Cake Decorator",
  fullName: "Lilo - Junior Cake Decorator",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "005",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 8,
  inkable: true,
  externalIds: {
    ravensburger: "9f1e57fa50cfe2c903d722580bbf99ab2cb544aa",
  },
  abilities: [
    {
      id: "183-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const liloJuniorCakeDecorator: LorcanitoCharacterCard = {
//   id: "yur",
//   name: "Lilo",
//   title: "Junior Cake Decorator",
//   characteristics: ["hero", "storyborn"],
//   text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
//   type: "character",
//   abilities: [supportAbility],
//   flavour: "Peanut butter and pineapple! This'll be the best cake ever!",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Olivier Désirée",
//   number: 8,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561596,
//   },
//   rarity: "common",
// };
//
