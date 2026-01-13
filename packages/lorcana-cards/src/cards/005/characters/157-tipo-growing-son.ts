import type { CharacterCard } from "@tcg/lorcana-types";

export const tipoGrowingSon: CharacterCard = {
  id: "1wt",
  cardType: "character",
  name: "Tipo",
  version: "Growing Son",
  fullName: "Tipo - Growing Son",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "MEASURE ME AGAIN When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 157,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f80eee1a0d8f58f63e04f6f9578c9d603326d912",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { putChosenCardFromYourHandIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const tipoGrowingSon: LorcanitoCharacterCard = {
//   id: "tq0",
//   name: "Tipo",
//   title: "Growing Son",
//   characteristics: ["storyborn", "ally"],
//   text: "**MEASURE ME AGAIN** When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "MEASURE ME AGAIN",
//       text: "When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
//       optional: true,
//       isPrivate: true,
//       effects: [putChosenCardFromYourHandIntoYourInkwellExerted],
//     },
//   ],
//   flavour: '"Mom, Mom! I think I’m still growing!"',
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Kapik",
//   number: 157,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560584,
//   },
//   rarity: "uncommon",
// };
//
