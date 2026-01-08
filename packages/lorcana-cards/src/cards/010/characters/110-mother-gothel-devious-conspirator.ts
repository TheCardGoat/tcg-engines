// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const motherGothelDeviousConspirator: LorcanitoCharacterCard = {
//   id: "t58",
//   name: "Mother Gothel",
//   title: "Devious Conspirator",
//   characteristics: ["storyborn", "villain", "sorcerer"],
//   text: "SOMEONE HAS TO MAKE USE OF THIS If a character was banished this turn, this character gets +2 {S}.",
//   type: "character",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   strength: 2,
//   willpower: 1,
//   illustrator: "Malia Ewart",
//   number: 110,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659190,
//   },
//   rarity: "common",
//   abilities: [
//     whileConditionThisCharacterGets({
//       name: "SOMEONE HAS TO MAKE USE OF THIS",
//       text: "If a character was banished this turn, this character gets +2 {S}.",
//       attribute: "strength",
//       amount: 2,
//       conditions: [
//         {
//           type: "this-turn",
//           value: "was-banished",
//           target: "self",
//           filters: [{ filter: "type", value: "character" }],
//           comparison: { operator: "gte", value: 1 },
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
