// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const donaldGhostHunter: LorcanitoCharacterCard = {
//   id: "yoy",
//   name: "Donald Duck",
//   title: "Ghost Hunter",
//   characteristics: ["dreamborn", "hero", "detective"],
//   text: "RAISE A RUCKUS When you play this character, choose a Detective character to gain Challenger +2 for the rest of this turn. (While challenging, that character gets +2 {S}.)",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 5,
//   willpower: 4,
//   illustrator: "Carmine Cassese",
//   number: 172,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659396,
//   },
//   rarity: "common",
//   abilities: [
//     whenYouPlayThis({
//       name: "RAISE A RUCKUS",
//       text: "When you play this character, choose a Detective character to gain Challenger +2 for the rest of this turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "characteristics", value: ["detective"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
