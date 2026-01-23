// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const donaldDuckSleepwalker: LorcanitoCharacterCard = {
//   id: "kjq",
//   reprints: ["w9x"],
//
//   name: "Donald Duck",
//   title: "Sleepwalker",
//   characteristics: ["storyborn"],
//   text: "**STARTLED AWAKE** Whenever you play an action, this character gets +2 {S} this turn.",
//   type: "character",
//   abilities: [
//     wheneverPlays({
//       name: "Startled Awake",
//       text: "Whenever you play an action, this character gets +2 {S} this turn.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["action"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Heading toward a rude awekening!",
//   inkwell: true,
//   colors: ["emerald"],
//   strength: 0,
//   cost: 3,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Leonardo Giammichele",
//   number: 78,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527194,
//   },
//   rarity: "common",
// };
//
