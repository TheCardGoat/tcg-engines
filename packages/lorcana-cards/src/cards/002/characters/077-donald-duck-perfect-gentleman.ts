// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const donaldDuckPerfectGentleman: LorcanitoCharacterCard = {
//   id: "pgk",
//   reprints: ["g8a"],
//   name: "Donald Duck",
//   title: "Perfect Gentleman",
//   characteristics: ["floodborn", "ally"],
//   text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Donald Duck._)\n**ALLOW ME** At the start of your turn, each player may draw a card.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "donald duck"),
//     atTheStartOfYourTurn({
//       name: "OWNER PLAYER Allow Me",
//       text: "At the start of your turn, each player may draw a card.",
//       effects: [
//         {
//           type: "create-layer-for-player",
//           target: opponent,
//           layer: {
//             type: "resolution",
//             name: "OPPO PLAYER Allow Me",
//             text: "At the start of your turn, each player may draw a card.",
//             optional: true,
//             responder: "opponent",
//             effects: [drawACard],
//           },
//         },
//         {
//           type: "create-layer-for-player",
//           target: self,
//           layer: {
//             type: "resolution",
//             responder: "self",
//             name: "OWNER PLAYER Allow Me",
//             text: "You may draw a card.",
//             optional: true,
//             effects: [drawACard],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Ron Baird",
//   number: 77,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526207,
//   },
//   rarity: "uncommon",
// };
//
