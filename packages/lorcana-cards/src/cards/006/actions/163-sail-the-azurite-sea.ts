import type { ActionCard } from "@tcg/lorcana-types";

export const sailTheAzuriteSea: ActionCard = {
  id: "yo2",
  cardType: "action",
  name: "Sail the Azurite Sea",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "006",
  text: "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
  cost: 2,
  cardNumber: 163,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7cf280d8897d60a0cb50595020fb50df421ba296",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   drawACard,
//   youMayPutAnAdditionalCardFromYourHandIntoYourInkwell,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const sailTheAzuriteSea: LorcanitoActionCard = {
//   id: "dwo",
//   name: "Sail The Azurite Sea",
//   characteristics: ["action"],
//   text: "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       resolveEffectsIndividually: true,
//       effects: [
//         youMayPutAnAdditionalCardFromYourHandIntoYourInkwell,
//         drawACard,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 0,
//   illustrator: "Valerio Buonfantino",
//   number: 163,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592008,
//   },
//   rarity: "common",
// };
//
