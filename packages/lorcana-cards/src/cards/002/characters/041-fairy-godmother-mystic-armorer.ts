import type { CharacterCard } from "@tcg/lorcana-types";

export const fairyGodmotherMysticArmorer: CharacterCard = {
  id: "fq8",
  cardType: "character",
  name: "Fairy Godmother",
  version: "Mystic Armorer",
  fullName: "Fairy Godmother - Mystic Armorer",
  inkType: ["amethyst"],
  franchise: "Cinderella",
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Fairy Godmother.)\nFORGET THE COACH, HERE'S A SWORD Whenever this character quests, your characters gain Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +3 {S} while challenging.)",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 41,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "38afe33729ebebc667c2357984ce9c75a090da76",
  },
  abilities: [],
  classifications: ["Floodborn", "Mentor", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AbilityEffect,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const fairyGodmotherMysticArmorer: LorcanitoCharacterCard = {
//   id: "fg2",
//
//   name: "Fairy Godmother",
//   title: "Mystic Armorer",
//   characteristics: ["floodborn", "fairy", "mentor"],
//   text: "**Shift** 2 _(You may pay 2 {I} to play this on top of one of your characters named Fairy Godmother.)_\n\n**FORGET THE COACH, HERE'S A SWORD** Whenever this character quests, your characters gain **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(2, "fairy godmother"),
//     wheneverQuests({
//       name: "Forget the Coach, Here's a Sword",
//       text: "Whenever this character quests, your characters gain **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 3,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         } as AbilityEffect,
//         {
//           type: "ability",
//           ability: "custom",
//           modifier: "add",
//           duration: "turn",
//           customAbility: whenThisCharacterBanishedInAChallenge({
//             effects: [
//               {
//                 type: "move",
//                 to: "hand",
//                 target: {
//                   type: "card",
//                   value: "all",
//                   filters: [{ filter: "source", value: "self" }],
//                 },
//               },
//             ],
//           }),
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         } as AbilityEffect,
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Filipe Laurentino",
//   number: 41,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527734,
//   },
//   rarity: "legendary",
// };
//
