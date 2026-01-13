// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const fixitFelixJrNicelandSteward: LorcanitoCharacterCard = {
//   id: "vqf",
//   name: "Fix‐It Felix, Jr.",
//   title: "Niceland Steward",
//   characteristics: ["hero", "floodborn"],
//   text: "**Shift 3** _(You may pay 3 {I} to play this on top of one of your characters named Fix-It Felix, Jr.)_ \n**BUILDING TOGETHER** Your locations get +2 {W}.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Fix-It Felix, Jr."),
//     {
//       type: "static",
//       ability: "effects",
//       name: "BUILDING TOGETHER",
//       text: "Your locations get +2 {W}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "willpower",
//           amount: 2,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "location" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 4,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Jidao Moara",
//   number: 12,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559773,
//   },
//   rarity: "uncommon",
// };
//
