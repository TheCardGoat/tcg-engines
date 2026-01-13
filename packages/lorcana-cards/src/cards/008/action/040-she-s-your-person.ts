// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   LorcanitoActionCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// const eachOfYourCharactersWithBodyGuard: CardEffectTarget = {
//   type: "card",
//   value: "all",
//   filters: [
//     { filter: "owner", value: "self" },
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//     { filter: "ability", value: "bodyguard" },
//   ],
// };
//
// const shesYourPersonAbility: ResolutionAbility = {
//   type: "resolution",
//   effects: [
//     {
//       type: "modal",
//       // TODO: Get rid of target
//       target: chosenCharacter,
//       modes: [
//         {
//           id: "1",
//           text: "Remove up to 3 damage from chosen character.",
//           effects: [
//             {
//               type: "heal",
//               amount: 3,
//               upTo: true,
//               target: chosenCharacter,
//             },
//           ],
//         },
//         {
//           id: "2",
//           text: "Remove up to 3 damage from each of your characters with Bodyguard.",
//           effects: [
//             {
//               type: "heal",
//               amount: 3,
//               upTo: true,
//               target: eachOfYourCharactersWithBodyGuard,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
//
// export const shesYourPerson: LorcanitoActionCard = {
//   id: "u6y",
//   name: "She's Your Person",
//   characteristics: ["action"],
//   text: "Choose one:\n• Remove up to 3 damage from chosen character.\n• Remove up to 3 damage from each of your characters with Bodyguard.",
//   type: "action",
//   inkwell: true,
//   colors: ["amber", "steel"],
//   cost: 1,
//   illustrator: "Sergio Márquez",
//   number: 40,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631378,
//   },
//   rarity: "uncommon",
//   abilities: [shesYourPersonAbility],
// };
//
