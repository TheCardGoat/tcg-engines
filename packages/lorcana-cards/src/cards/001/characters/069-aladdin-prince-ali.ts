import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinPrinceAli: CharacterCard = {
  id: "j5x",
  cardType: "character",
  name: "Aladdin",
  version: "Prince Ali",
  fullName: "Aladdin - Prince Ali",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**Ward** _(Opponents can",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 69,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Hero", "Storyborn", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const aladdinPrinceAli: LorcanitoCharacterCard = {
//   id: "j5x",
//   reprints: ["n78"],
//
//   name: "Aladdin",
//   title: "Prince Ali",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**Ward** _(Opponents can't choose this character except to challenge.)_",
//   type: "character",
//   illustrator: "Lauren Walsh",
//   abilities: [wardAbility],
//   flavour:
//     "Fabulously wealthy. Practically untouchable. Genuinely inauthentic.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   number: 69,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 485361,
//   },
//   rarity: "common",
// };
//
