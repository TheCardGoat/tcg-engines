import type { CharacterCard } from "@tcg/lorcana-types";

export const princeEricDashingAndBrave: CharacterCard = {
  id: "omx",
  cardType: "character",
  name: "Prince Eric",
  version: "Dashing and Brave",
  fullName: "Prince Eric - Dashing and Brave",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 187,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_",
      id: "omx-1",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  classifications: ["Hero", "Storyborn", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ChallengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const priceEricDashingAndBrave: LorcanitoCharacterCard = {
//   id: "omx",
//   reprints: ["rfl"],
//
//   name: "Prince Eric",
//   title: "Dashing and Brave",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "challenger",
//       value: 2,
//       text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
//     } as ChallengerAbility,
//   ],
//   flavour: "I lost her once! I'm not gonna lose her again!",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Cristian Romero",
//   number: 187,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508933,
//   },
//   rarity: "common",
// };
//
