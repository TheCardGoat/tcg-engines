// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { forEachCardInYourDiscard } from "@lorcanito/lorcana-engine/abilities/amounts";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import {
//   thisCharacterGetsStrength,
//   youMayDrawThenChooseAndDiscard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const namaariSinglemindedRival: LorcanitoCharacterCard = {
//   id: "l8m",
//   name: "Namaari",
//   title: "Single-Minded Rival",
//   characteristics: ["storyborn", "villain", "princess"],
//   text: "STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.\nEXTREME FOCUS This character gets +1 {S} for each card in your discard.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "EXTREME FOCUS",
//       text: "This character gets +1 {S} for each card in your discard.",
//       effects: [thisCharacterGetsStrength(forEachCardInYourDiscard)],
//     },
//     whenYouPlayThis({
//       ...youMayDrawThenChooseAndDiscard,
//       name: "STRATEGIC EDGE",
//       text: "When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.",
//     }),
//     atTheStartOfYourTurn({
//       ...youMayDrawThenChooseAndDiscard,
//       name: "STRATEGIC EDGE",
//       text: "When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.",
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 0,
//   willpower: 5,
//   illustrator: "Max Ulrichney",
//   number: 198,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631849,
//   },
//   rarity: "legendary",
//   lore: 2,
// };
//
