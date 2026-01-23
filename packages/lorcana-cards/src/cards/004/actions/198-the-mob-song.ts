// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   DamageEffect,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const theMobSong: LorcanitoActionCard = {
//   id: "h6n",
//   reprints: ["fj5"],
//   name: "The Mob Song",
//   characteristics: ["action", "song"],
//   text: "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nDeal 3 damage to up to 3 chosen characters and/or locations.",
//   type: "action",
//   abilities: [
//     singerTogetherAbility(10),
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "damage",
//           amount: 3,
//           target: {
//             type: "card",
//             value: 3,
//             upTo: true,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: ["character", "location"] },
//             ],
//           },
//         } as DamageEffect,
//       ],
//     },
//   ],
//   colors: ["steel"],
//   cost: 10,
//   illustrator: "Ian MacDonald",
//   number: 198,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547841,
//   },
//   rarity: "uncommon",
// };
//
