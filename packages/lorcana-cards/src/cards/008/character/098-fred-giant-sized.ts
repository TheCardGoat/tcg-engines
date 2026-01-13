// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
// import type { RevealFromTopUntilCardEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const floodBornCharInYourDeck: CardEffectTarget = {
//   type: "card",
//   value: "all",
//   filters: [
//     { filter: "type", value: "character" },
//     { filter: "characteristics", value: ["floodborn"] },
//   ],
// };
//
// const revealTopCardEffect: RevealFromTopUntilCardEffect = {
//   type: "reveal-from-top-until",
//   target: floodBornCharInYourDeck,
//   onTargetMatchEffects: [
//     {
//       type: "create-layer-based-on-target",
//       filters: floodBornCharInYourDeck.filters,
//       // TODO: get rid of target
//       target: floodBornCharInYourDeck,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: floodBornCharInYourDeck,
//         },
//       ],
//     },
//   ],
// };
//
// export const fredGiantsized: LorcanitoCharacterCard = {
//   id: "fgp",
//   name: "Fred",
//   title: "Giant-Sized",
//   characteristics: ["floodborn", "hero"],
//   text: "Shift 5\n\nI LIKE WHERE THIS IS HEADING Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "Fred"),
//     wheneverQuests({
//       name: "I LIKE WHERE THIS IS HEADING",
//       text: "Whenever this character quests, reveal cards from the top of your deck until you reveal a Floodborn character card. Put that card into your hand and shuffle the rest into your deck.",
//       effects: [
//         revealTopCardEffect,
//         {
//           type: "shuffle-deck",
//           target: self,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 7,
//   strength: 5,
//   willpower: 6,
//   illustrator: "Jules Dubost",
//   number: 98,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 632710,
//   },
//   rarity: "rare",
//   lore: 3,
// };
//
