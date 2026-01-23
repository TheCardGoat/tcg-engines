// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const annaTrueHearted: LorcanitoCharacterCard = {
//   id: "lok",
//   reprints: ["p5i"],
//   missingTestCase: true,
//   name: "Anna",
//   title: "True-Hearted",
//   characteristics: ["hero", "dreamborn", "queen", "knight"],
//   text: "**LET ME HELP YOU** Whenever this character quests, your other Hero characters get +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "Let me help you",
//       text: "Whenever this character quests, your other Hero characters get +1 {L} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             excludeSelf: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["hero"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "Make sure you know what's truly important and be willing to fight for it.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Leonardo Giammichele",
//   number: 138,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550517,
//   },
//   rarity: "super_rare",
// };
//
