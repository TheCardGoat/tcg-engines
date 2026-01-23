import type { CharacterCard } from "@tcg/lorcana-types";

export const cobraBubblesFormerCia: CharacterCard = {
  id: "1r8",
  cardType: "character",
  name: "Cobra Bubbles",
  version: "Former CIA",
  fullName: "Cobra Bubbles - Former CIA",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTHINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 188,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e3e47e553b80da5e66909453f91e285f5af8e7bb",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const cobraBubblesFormerCia: LorcanitoCharacterCard = {
//   id: "agb",
//   missingTestCase: true,
//   name: "Cobra Bubbles",
//   title: "Former CIA",
//   characteristics: ["dreamborn", "ally"],
//   text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTHINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.",
//   type: "character",
//   abilities: [
//     bodyguardAbility,
//     {
//       ...youMayDrawThenChooseAndDiscard,
//       type: "activated",
//       costs: [{ type: "ink", amount: 2 }],
//       name: "Think About What's Best",
//       text: "Draw a card, then choose and discard a card.",
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Eri Welli",
//   number: 188,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592010,
//   },
//   rarity: "rare",
// };
//
