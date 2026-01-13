// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   DynamicAmount,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   drawXCards,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// const singers: DynamicAmount = {
//   dynamic: true,
//   filters: [
//     {
//       filter: "sing",
//       value: "singer",
//     },
//   ],
// };
//
// export const fantasticalAndMagical: LorcanitoActionCard = {
//   id: "h9s",
//   name: "Fantastical And Magical",
//   characteristics: ["action", "song"],
//   text: "Sing Together 9\nFor each character that sang this song, draw a card and gain 1 lore.",
//   type: "action",
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 9,
//   illustrator: "Natalia Trykowska",
//   number: 79,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631401,
//   },
//   rarity: "rare",
//   abilities: [
//     singerTogetherAbility(9),
//     {
//       type: "resolution",
//       resolveAmountBeforeCreatingLayer: true,
//       effects: [youGainLore(singers), drawXCards(singers)],
//     },
//   ],
// };
//
