// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const jetsamUrsulasBaby: LorcanitoCharacterCard = {
//   id: "tpe",
//   missingTestCase: true,
//   name: "Jetsam",
//   title: 'Ursula\'s "Baby"',
//   characteristics: ["dreamborn", "ally"],
//   text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_\n\n\n**OMINOUS PAIR** Your characters named Flotsam gain **Challenger** +2.",
//   type: "character",
//   abilities: [
//     challengerAbility(2),
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Ominous Pair",
//       text: "Your characters named Flotsam gain **Challenger** +2.",
//       gainedAbility: challengerAbility(2),
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           {
//             filter: "attribute",
//             value: "name",
//             comparison: { operator: "eq", value: "Floatsam" },
//           },
//         ],
//       },
//     },
//   ],
//   flavour: "He snatched the trident from the betrayed glimmer.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Brian Kesinger",
//   number: 46,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549468,
//   },
//   rarity: "common",
// };
//
