import type { ActionCard } from "@tcg/lorcana-types";

export const heHurledHisThunderbolt: ActionCard = {
  id: "h6t",
  cardType: "action",
  name: "He Hurled His Thunderbolt",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "010",
  text: "Deal 4 damage to chosen character. Your Deity characters gain Challenger +2 this turn. (They get +2 {S} while challenging.)",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 197,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3df3672475d3e1613abd59e34cc44da9380373b9",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AbilityEffect,
//   DamageEffect,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
//
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// // Target for your Deity characters
// const yourDeityCharacters = {
//   type: "card" as const,
//   value: "all" as const,
//   filters: [
//     { filter: "type" as const, value: "character" as const },
//     { filter: "zone" as const, value: "play" as const },
//     { filter: "owner" as const, value: "self" as const },
//     { filter: "characteristics" as const, value: ["deity" as const] },
//   ],
// };
//
// // Effect to grant Challenger +2 to Deity characters for this turn
// const deityCharactersGainChallengerPlus2: AbilityEffect = {
//   type: "ability",
//   ability: "challenger",
//   amount: 2,
//   modifier: "add",
//   duration: "turn",
//   target: yourDeityCharacters,
// };
//
// export const heHurledHisThunderbolt: LorcanitoActionCard = {
//   id: "mgc",
//   name: "He Hurled His Thunderbolt",
//   characteristics: ["action", "song"],
//   text: "Deal 4 damage to chosen character. Your Deity characters gain Challenger +2 this turn. (They get +2 {S} while challenging.)",
//   type: "action",
//   inkwell: false,
//   colors: ["steel"],
//   cost: 4,
//   illustrator: "Carlos Luzzi",
//   number: 197,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659950,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [deityCharactersGainChallengerPlus2],
//     },
//     {
//       type: "resolution",
//       text: "Deal 4 damage to chosen character.",
//       effects: [
//         {
//           type: "damage",
//           amount: 4,
//           target: chosenCharacter,
//         } as DamageEffect,
//       ],
//     },
//   ],
// };
//
