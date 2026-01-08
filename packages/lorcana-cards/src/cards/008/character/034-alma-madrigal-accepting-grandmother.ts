// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { wheneverOneOrMoreOfYourCharSingsASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const almaMadrigalAcceptingGrandmother: LorcanitoCharacterCard = {
//   id: "h1w",
//   name: "Alma Madrigal",
//   title: "Accepting Grandmother",
//   characteristics: ["storyborn", "mentor", "madrigal"],
//   text: "THE MIRACLE IS YOU Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber", "amethyst"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Simone Buonfantino",
//   number: 34,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631374,
//   },
//   rarity: "uncommon",
//   lore: 2,
//   abilities: [
//     wheneverOneOrMoreOfYourCharSingsASong({
//       name: "THE MIRACLE IS YOU",
//       text: "Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.",
//       oncePerTurn: true,
//       conditions: [duringYourTurn],
//       optional: true,
//       effects: [
//         {
//           type: "exert",
//           exert: false,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "sing", value: "singer" }],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
